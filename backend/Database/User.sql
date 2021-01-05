CREATE TABLE "User"
(
    Id SERIAL,
    EmailAddress varchar,
    Password varchar,
    FirstName varchar,
    LastName varchar,
    LastLoginDate timestamp DEFAULT NOW()
);

CREATE TABLE Staff
(
    Id SERIAL,
    UserId int
);

CREATE TABLE RefreshTokens
(
    Id SERIAL,
    UserId int,
    RefreshToken varchar,
    IsValid boolean,
    IsUsed boolean
);