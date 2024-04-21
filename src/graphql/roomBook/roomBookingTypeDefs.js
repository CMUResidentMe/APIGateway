import { gql } from "apollo-server-express";

export const roomBookingTypeDefs = gql`
  type BookedTime {
    id: ID!
    date: String!
    startTime: String!
    endTime: String!
    user_id: String!
    user_name: String!
    is_confirmed: Boolean!
  }
  type Room {
    id: ID!
    name: String!
    room_type: String!
    bookedTimes: [BookedTime]
  }

  type Booking {
    id: ID!
    user_id: String!
    date: String!
    start_time: String!
    end_time: String!
    is_confirmed: Boolean!
  }
  type ExtendedBookedTime {
    booking_id: ID!
    room_name: String!
    room_id: ID!
    date: String!
    startTime: String!
    endTime: String!
    user_id: String!
    user_name: String!
    is_confirmed: Boolean!
  }

  type Query {
    allRooms: [Room]
    roomsByType(room_type: String!): [Room]
    unconfirmedPartyRooms: [Room]
    bookingsByUser: [ExtendedBookedTime]
  }

  type Mutation {
    createBooking(
      room_id: ID!
      date: String!
      start_time: String!
      end_time: String!
    ): Room
    createRoom(name: String!, room_type: String!): Room
    cancelBooking(room_id: ID!, booking_id: ID!): Room
    approveBooking(booking_id: ID!): Booking
    declineBooking(booking_id: ID!): Booking
    deleteRoom(room_id: ID!): Boolean
    cancelBookingWithReason(booking_id: ID!, reason: String!): Booking
  }
`;
