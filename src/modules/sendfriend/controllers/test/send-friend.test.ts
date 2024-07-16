// // test/friendRequestController.test.ts
// import HTTP_STATUS from 'http-status-codes';

// describe('FriendRequestController', () => {
//   let controller: FriendRequestController;

//   beforeEach(() => {
//     controller = new FriendRequestController();
//   });

//   it('should send a friend request', async () => {
//     const ctx = createMockContext({
//       method: 'POST',
//       url: '/send',
//       body: {
//         receiverId: 'someUserId'
//       }
//     });

//     await controller.sendFriendRequest(ctx.req, ctx.res);

//     expect(ctx.res.statusCode).toBe(HTTP_STATUS.CREATED);
//     expect(ctx.res._getJSONData()).toHaveProperty('message');
//   });

//   // Más pruebas para acceptFriendRequest y rejectFriendRequest
// });
