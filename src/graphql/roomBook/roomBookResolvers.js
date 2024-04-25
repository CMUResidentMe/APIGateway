import { userService } from "../../utils/UserService.js";
import { roomBookingController } from "../../controllers/roomBookController.js";

export const roomBookingResolvers = {
  // Query resolvers
  Query: {
    // get all the rooms with its bookings
    allRooms: async (_, __, context) => {
      console.log("Fetching all rooms");
      return roomBookingController.getAllRooms();
    },
    // getting all the rooms by its type
    roomsByType: async (_, { room_type }, context) => {
      console.log(`Fetching rooms by type: ${room_type}`);
      return roomBookingController.getRoomsByType(room_type);
    },
    // getting all the unconfirmed party rooms
    unconfirmedPartyRooms: async (_, __, context) => {
      console.log("Fetching unconfirmed party rooms");
      const result = roomBookingController.getUnconfirmedPartyRooms();
      console.log("API resolver result", result);
      return roomBookingController.getUnconfirmedPartyRooms();
    },
    // getting all the bookings by a user
    bookingsByUser: async (_, __, context) => {
      console.log("Fetching bookings for user", context.user);
      const user = await userService.getUserById(context.user);
      return roomBookingController.getBookingsByUser(context.user);
    },
  },
  // Mutation resolvers
  // The user object is retrieved from querying the user service using the user ID from the context.
  Mutation: {
    // let user create a booking
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
      return roomBookingController.createBooking({
        room_id,
        user_id: context.user, // user_id from context or from the args directly
        user_name: user.username,
        date,
        start_time,
        end_time,
      });
    },
    // let a user cancel their booking
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
    // let a manager approve a booking
    approveBooking: async (_, { booking_id }, context) => {
      try {
        // const user = await userService.getUserById(context.user);
        // console.log(
        //   `Approving booking for user: ${user.username} (ID: ${context.user})`
        // );

        // Perform the booking approval
        console.log("bookingID", booking_id);
        const booking = await roomBookingController.approveBooking({
          booking_id,
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
    // let a manager decline a booking
    declineBooking: async (_, { booking_id }, context) => {
      try {
        // const user = await userService.getUserById(context.user);
        // console.log(
        //   `Declining booking for user: ${user.username} (ID: ${context.user})`
        // );

        const booking = await roomBookingController.declineBooking({
          booking_id,
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
    // let a manager create a room
    createRoom: async (_, { name, room_type }, context) => {
      console.log(`Creating room with name: ${name} and type: ${room_type}`);
      return roomBookingController.createRoom({ name, room_type });
    },
    // let a manager delete a room
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
