import { userService } from "../../utils/UserService.js";
import { roomBookingController } from "../../controllers/roomBookController.js";

export const roomBookingResolvers = {
  Query: {
    allRooms: async (_, __, context) => {
      console.log("Fetching all rooms");
      // Fetching user details from the context, assuming it includes the user ID.
      const user = await userService.getUserById(context.user);
      console.log(`User fetched: ${user.username}`);
      return roomBookingController.getAllRooms();
    },
    roomsByType: async (_, { room_type }, context) => {
      console.log(`Fetching rooms by type: ${room_type}`);
      return roomBookingController.getRoomsByType(room_type);
    },
    unconfirmedPartyRooms: async (_, __, context) => {
      console.log("Fetching unconfirmed party rooms");
      return roomBookingController.getUnconfirmedPartyRooms();
    },
  },
  Mutation: {
    createBooking: async (
      _,
      { room_id, user_id, user_name, date, start_time, end_time },
      context
    ) => {
      // Fetch user details from context
      const user = await userService.getUserById(context.user);
      console.log(
        `Creating booking for user: ${user.username} (ID: ${context.user})`
      );
      // Additional user_name passed to the controller if necessary
      return roomBookingController.createBooking({
        room_id,
        user_id: context.user, // user_id from context or from the args directly
        user_name: user.username, // Ensuring username is passed if required
        date,
        start_time,
        end_time,
      });
    },
    cancelBooking: async (_, { room_id, booking_id }, context) => {
      const user = await userService.getUserById(context.user);
      console.log(
        `Cancelling booking for user: ${user.username} (ID: ${context.user})`
      );
      return roomBookingController.cancelBooking({
        room_id,
        booking_id,
        user_id: context.user,
      });
    },
    approveBooking: async (_, { booking_id }, context) => {
      try {
        const user = await userService.getUserById(context.user);
        console.log(
          `Approving booking for user: ${user.username} (ID: ${context.user})`
        );

        // Perform the booking approval
        console.log("bookingID", booking_id);
        const booking = await roomBookingController.approveBooking({
          booking_id,
          user_id: context.user,
        });
        // Check if the booking or associated room is null after approval
        console.log("BOOKING", booking);
        if (!booking) {
          throw new Error("Booking approval failed, booking might not exist.");
        }
        return booking;
      } catch (error) {
        console.error("Error during booking approval:", error);
        throw new Error(
          `Error approving booking: ${error.message || "Unknown error"}`
        );
      }
    },
    declineBooking: async (_, { booking_id }, context) => {
      try {
        const user = await userService.getUserById(context.user);
        console.log(
          `Declining booking for user: ${user.username} (ID: ${context.user})`
        );

        const booking = await roomBookingController.declineBooking({
          booking_id,
          user_id: context.user,
        });

        if (!booking) {
          throw new Error("Booking decline failed, booking might not exist.");
        }

        return booking;
      } catch (error) {
        console.error("Error during booking decline:", error);
        throw new Error(
          `Error declining booking: ${error.message || "Unknown error"}`
        );
      }
    },
    createRoom: async (_, { name, room_type }, context) => {
      console.log(`Creating room with name: ${name} and type: ${room_type}`);
      return roomBookingController.createRoom({ name, room_type });
    },
    deleteRoom: async (_, { room_id }, context) => {
      const user = await userService.getUserById(context.user);
      console.log(
        `Deleting room for user: ${user.username} (ID: ${context.user})`
      );
      return roomBookingController.deleteRoom({
        room_id,
        user_id: context.user,
      });
    },
    cancelBookingWithReason: async (_, { booking_id, reason }, context) => {
      const user = await userService.getUserById(context.user);
      console.log(
        `Cancelling booking with reason for user: ${user.username} (ID: ${context.user})`
      );
      return roomBookingController.cancelBookingWithReason({
        booking_id,
        reason,
        user_id: context.user,
      });
    },
  },
};
