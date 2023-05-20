using FakeItEasy;
using System.Linq.Expressions;
using UpSchool.Domain.Data;
using UpSchool.Domain.Entities;
using UpSchool.Domain.Services;

namespace UpSchool.Domain.Tests.Services
{
    public class UserServiceTests
    {
        [Fact]
        public async Task GetUser_ShouldGetUserWithCorrectId()
        {
            var userRepositoryMock = A.Fake<IUserRepository>();

            Guid userId = new Guid("8f319b0a-2428-4e9f-b7c6-ecf78acf00f9");

            var cancellationSource = new CancellationTokenSource();

            var expectedUser = new User()
            {
                Id = userId
            };

            A.CallTo(() =>  userRepositoryMock.GetByIdAsync(userId, cancellationSource.Token))
                .Returns(Task.FromResult(expectedUser));

            IUserService userService = new UserManager(userRepositoryMock);

            var user = await userService.GetByIdAsync(userId, cancellationSource.Token);

            Assert.Equal(expectedUser, user);
        }

        [Fact]
        public async Task AddAsync_ShouldThrowException_WhenEmailIsEmptyOrNull()
        {

            var userRepositoryMock = A.Fake<IUserRepository>();
            var cancellationSource = new CancellationTokenSource();

            IUserService userService = new UserManager(userRepositoryMock);

            await Assert.ThrowsAsync<ArgumentException>(async () =>
            {
                await userService.AddAsync("aybike", "boran", 23, string.Empty, cancellationSource.Token);
            });
            await Assert.ThrowsAsync<ArgumentException>(async () =>
            {
                await userService.AddAsync("aybike", "boran", 23, null, cancellationSource.Token);
            });

         }

        [Fact]
        public async Task AddAsync_ShouldReturn_CorrectUserId()
        {
            var userRepositoryMock = A.Fake<IUserRepository>();
            var cancellationSource = new CancellationTokenSource();
            var userId = Guid.NewGuid();

            A.CallTo(() => userRepositoryMock.AddAsync(A<User>._, cancellationSource.Token))
                .Invokes((User user, CancellationToken token) =>
                {
                    user.Id = userId;
                });

            IUserService userService = new UserManager(userRepositoryMock);

            var result = await userService.AddAsync("ike", "b", 23, "ikeb@gmail.com", cancellationSource.Token);

            Assert.Equal(userId, result);

        }

        [Fact]
            public async Task DeleteAsync_ShouldReturnTrue_WhenUserExists()
            {

                var userRepositoryMock = A.Fake<IUserRepository>();
                var cancellationSource = new CancellationTokenSource();

                var userId = Guid.NewGuid();

                A.CallTo(() => userRepositoryMock.DeleteAsync(A<Expression<Func<User, bool>>>._, cancellationSource.Token))
                    .Returns(1);

                IUserService userService = new UserManager(userRepositoryMock);

                var result = await userService.DeleteAsync(userId, cancellationSource.Token);

                Assert.True(result);
            }

        [Fact]
        public async Task DeleteAsync_ShouldThrowException_WhenUserDoesntExists()
        {
            var userRepositoryMock = A.Fake<IUserRepository>();
            var cancellationSource = new CancellationTokenSource();

            var userId = Guid.NewGuid();
            A.CallTo(() => userRepositoryMock.DeleteAsync(A<Expression<Func<User, bool>>>._, cancellationSource.Token))
                .Returns(0);

            IUserService userService = new UserManager(userRepositoryMock);

            var result = await userService.DeleteAsync(userId, cancellationSource.Token);

            Assert.False(result);

        }

        [Fact]
        public async Task UpdateAsync_ShouldThrowException_WhenUserIdIsEmpty()
            {

            var userRepositoryMock = A.Fake<IUserRepository>();
            var cancellationSource = new CancellationTokenSource();
            var user = new User
            {
                Id = Guid.Empty,
            };

            IUserService userService = new UserManager(userRepositoryMock);

            await Assert.ThrowsAsync<ArgumentException>(async () =>
                {
                    await userService.UpdateAsync(user, cancellationSource.Token);
                });
            }

        [Fact]
        public async Task UpdateAsync_ShouldThrowException_WhenUserEmailEmptyOrNull()
        {
            var userRepositoryMock = A.Fake<IUserRepository>();
            var userId = Guid.NewGuid();
            var user = new User
            {
                Id = userId,
            };
            IUserService userService = new UserManager(userRepositoryMock);

            await Assert.ThrowsAsync<ArgumentException>(async () =>
            {
                user.Email = null;
                await userService.UpdateAsync(user, CancellationToken.None);
            });

            await Assert.ThrowsAsync<ArgumentException>(async () =>
            {
                user.Email = string.Empty;
                await userService.UpdateAsync(user, CancellationToken.None);
            });

        }

        [Fact]
        public async Task GetAllAsync_ShouldReturn_UserListWithAtLeastTwoRecords()
            {

            var userRepositoryMock = A.Fake<IUserRepository>();
            var cancellationSource = new CancellationTokenSource();

            var userList = new List<User>
            {
                new User { Id = Guid.NewGuid(), FirstName = "aybike", LastName = "Boran", Age = 23, Email = "ike@gmail.com" },
                new User { Id = Guid.NewGuid(), FirstName = "aybike", LastName = "Boran", Age = 23, Email = "ike@gmail.com" },
            };

            A.CallTo(() => userRepositoryMock.GetAllAsync(cancellationSource.Token))
                .Returns(userList);

            IUserService userService = new UserManager(userRepositoryMock);

            var result = await userService.GetAllAsync(cancellationSource.Token);

            Assert.True(result.Count >= 2);
        }
    }
}

