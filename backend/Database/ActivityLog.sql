CREATE TABLE ActivityLog (
    Id SERIAL,
    Type varchar,
    "User" int,
    Description varchar,
    Date timestamp NOT NULL DEFAULT NOW()
)
