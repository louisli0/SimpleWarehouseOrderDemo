CREATE TABLE Ticket (
    Id SERIAL,
    RegisteredItemId text [],
    Status boolean,
    Type varchar,
    AssignedTo int,
    Creator int,
    LastUpdated timestamp
);

CREATE TABLE TicketActivity (
    Id SERIAL,
    TicketId int,
    CreatedAt timestamp,
    CreatedBy int,
    Description varchar
);