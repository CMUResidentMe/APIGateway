import { GraphQLClient, gql } from "graphql-request";

class RoomBookingController {
  constructor() {
    this.graphqlClient = new GraphQLClient(
      process.env.ROOM_BOOKING_SERVICE_URL
    );
    console.log(
      "Room Booking Client initialized with URL: ",
      process.env.ROOM_BOOKING_SERVICE_URL
    );
  }
  async getAllRooms() {
    const query = gql`
      query GetAllRooms {
        allRooms {
          id
          name
          room_type
          bookedTimes {
            date
            startTime
            endTime
            user_id
            user_name
            is_confirmed
          }
        }
      }
    `;

    try {
      const result = await this.graphqlClient.request(query);
      return result.allRooms;
    } catch (error) {
      console.error("Error fetching all rooms:", error);
      throw new Error("Failed to fetch all rooms.");
    }
  }
  async getBookingsByUser(user_id) {
    const query = gql`
      query GetBookingsByUser($user_id: String!) {
        bookingsByUser(user_id: $user_id) {
          date
          startTime
          endTime
          user_name
          user_id
          is_confirmed
          room_id
          booking_id
          room_name
        }
      }
    `;
    const variables = { user_id };
    try {
      const result = await this.graphqlClient.request(query, variables);
      console.log("Fetched bookings for user:", result);
      return result.bookingsByUser;
    } catch (error) {
      console.error("Error fetching bookings by user:", error);
      throw new Error("Failed to fetch bookings for user.");
    }
  }
  async getUnconfirmedPartyRooms() {
    const query = gql`
      query GetUnconfirmedPartyRooms {
        unconfirmedPartyRooms {
          id
          name
          room_type
          bookedTimes {
            id
            date
            startTime
            endTime
            user_id
            user_name
            is_confirmed
          }
        }
      }
    `;

    try {
      const result = await this.graphqlClient.request(query);
      return result.unconfirmedPartyRooms;
    } catch (error) {
      console.error("Error fetching unconfirmed party rooms:", error);
      throw new Error("Failed to fetch unconfirmed party rooms.");
    }
  }

  async getRoomsByType(room_type) {
    const query = gql`
      query GetRoomsByType($room_type: String!) {
        roomsByType(room_type: $room_type) {
          id
          name
          room_type
          bookedTimes {
            date
            startTime
            endTime
            user_id
            user_name
            is_confirmed
          }
        }
      }
    `;
    const variables = { room_type };
    console.log("variables", variables);
    try {
      const result = await this.graphqlClient.request(query, variables);
      console.log("get rom result", result);
      console.log("get rom result rooms by type", result.roomsByType);
      return result.roomsByType.map((room) => ({
        ...room,
        availableTimes: this.calculateAvailableTimes(room.bookedTimes),
      }));
    } catch (error) {
      console.error(`Error fetching rooms by type (${room_type}):`, error);
      throw new Error(`Failed to fetch rooms of type ${room_type}.`);
    }
  }
  calculateAvailableTimes(bookedTimes) {
    const dayStart = "09:00";
    const dayEnd = "17:00";
    const openTime = this.timeToMinutes(dayStart);
    const closeTime = this.timeToMinutes(dayEnd);
    let availableTimes = [{ start: openTime, end: closeTime }];

    bookedTimes.forEach(({ startTime, endTime }) => {
      const start = this.timeToMinutes(startTime);
      const end = this.timeToMinutes(endTime);
      availableTimes = availableTimes.reduce((acc, time) => {
        if (start <= time.start && end >= time.end) {
          return acc;
        } else if (start <= time.start && end < time.end) {
          acc.push({ start: end, end: time.end });
        } else if (start > time.start && end < time.end) {
          acc.push(
            { start: time.start, end: start },
            { start: end, end: time.end }
          );
        } else if (start > time.start && end >= time.end) {
          acc.push({ start: time.start, end: start });
        } else {
          acc.push(time);
        }
        return acc;
      }, []);
    });

    return availableTimes.map((time) => ({
      startTime: this.minutesToTime(time.start),
      endTime: this.minutesToTime(time.end),
    }));
  }

  timeToMinutes(time) {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  }

  minutesToTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}`;
  }

  async createBooking({
    room_id,
    user_id,
    user_name,
    date,
    start_time,
    end_time,
  }) {
    const mutation = gql`
      mutation CreateBooking(
        $room_id: ID!
        $user_id: String!
        $user_name: String!
        $date: String!
        $start_time: String!
        $end_time: String!
      ) {
        createBooking(
          room_id: $room_id
          user_id: $user_id
          user_name: $user_name
          date: $date
          start_time: $start_time
          end_time: $end_time
        ) {
          id
          name
          room_type
          bookedTimes {
            date
            startTime
            endTime
            user_id
            user_name
            is_confirmed
          }
        }
      }
    `;
    const variables = {
      room_id,
      user_id,
      user_name,
      date,
      start_time,
      end_time,
    };
    try {
      return (await this.graphqlClient.request(mutation, variables))
        .createBooking;
    } catch (error) {
      console.error("Error creating booking:", error);

      // Check for specific error message from the backend and rethrow a more descriptive error
      if (error.response && error.response.errors) {
        const message = error.response.errors
          .map((err) => err.message)
          .join("; ");
        if (message.includes("Time slot is already booked")) {
          throw new Error(
            "The selected time slot is already booked. Please choose another time."
          );
        }
      }

      // Generic error if no specific handling is possible
      throw new Error("Failed to create booking due to a server error.");
    }
  }

  async cancelBooking({ room_id, booking_id, user_id }) {
    const mutation = gql`
      mutation CancelBooking(
        $room_id: ID!
        $booking_id: ID!
        $user_id: String!
      ) {
        cancelBooking(
          room_id: $room_id
          booking_id: $booking_id
          user_id: $user_id
        ) {
          id
          name
          room_type
          bookedTimes {
            date
            startTime
            endTime
            user_id
            user_name
            is_confirmed
          }
        }
      }
    `;
    const variables = { room_id, booking_id, user_id };
    try {
      return (await this.graphqlClient.request(mutation, variables))
        .cancelBooking;
    } catch (error) {
      console.error("Error cancelling booking:", error);
      throw new Error("Failed to cancel booking.");
    }
  }

  async approveBooking({ booking_id }) {
    const mutation = gql`
      mutation ApproveBooking($booking_id: ID!) {
        approveBooking(booking_id: $booking_id) {
          id
          user_id
          date
          start_time
          end_time
          is_confirmed
        }
      }
    `;
    const variables = { booking_id };
    try {
      const response = await this.graphqlClient.request(mutation, variables);
      return response.approveBooking;
    } catch (error) {
      console.error("Error approving booking:", error);
      throw new Error("Failed to approve booking.");
    }
  }

  async declineBooking({ booking_id }) {
    const mutation = gql`
      mutation DeclineBooking($booking_id: ID!) {
        declineBooking(booking_id: $booking_id) {
          id
          user_id
          date
          start_time
          end_time
          is_confirmed
        }
      }
    `;
    const variables = { booking_id };
    try {
      const response = await this.graphqlClient.request(mutation, variables);
      return response.declineBooking;
    } catch (error) {
      console.error("Error declining booking:", error);
      throw new Error("Failed to decline booking.");
    }
  }
  async createRoom({ name, room_type }) {
    const mutation = gql`
      mutation CreateRoom($name: String!, $room_type: String!) {
        createRoom(name: $name, room_type: $room_type) {
          id
          name
          room_type
          bookedTimes {
            date
            startTime
            endTime
            user_id
            user_name
            is_confirmed
          }
        }
      }
    `;
    const variables = { name, room_type };
    try {
      return (await this.graphqlClient.request(mutation, variables)).createRoom;
    } catch (error) {
      console.error("Error creating room:", error);
      throw new Error("Failed to create room.");
    }
  }

  async deleteRoom({ room_id }) {
    const mutation = gql`
      mutation DeleteRoom($room_id: ID!) {
        deleteRoom(room_id: $room_id)
      }
    `;
    const variables = { room_id };
    try {
      return (await this.graphqlClient.request(mutation, variables)).deleteRoom;
    } catch (error) {
      console.error("Error deleting room:", error);
      throw new Error("Failed to delete room.");
    }
  }

  async cancelBookingWithReason({ booking_id, reason }) {
    const mutation = gql`
      mutation CancelBookingWithReason($booking_id: ID!, $reason: String!) {
        cancelBookingWithReason(booking_id: $booking_id, reason: $reason) {
          id
          room {
            id
            name
            room_type
            bookedTimes {
              date
              startTime
              endTime
              user_id
              user_name
              is_confirmed
            }
          }
          user_id
          date
          start_time
          end_time
          is_confirmed
          reason
        }
      }
    `;
    const variables = { booking_id, reason };
    try {
      return (await this.graphqlClient.request(mutation, variables))
        .cancelBookingWithReason;
    } catch (error) {
      console.error("Error cancelling booking with reason:", error);
      throw new Error("Failed to cancel booking with reason.");
    }
  }
}

export const roomBookingController = new RoomBookingController();
