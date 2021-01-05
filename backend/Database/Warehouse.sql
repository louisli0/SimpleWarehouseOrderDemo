CREATE TABLE Warehouse (
    Id SERIAL,
    Name varchar NOT NULL DEFAULT 'Warehouse Name'
);

CREATE TABLE Inventory (
    Id SERIAL,
    ItemId int NOT NULL,
    WarehouseId int NOT NULL,
    Quantity int NOT NULL DEFAULT 0
);

CREATE TABLE TransportOrder (
    Id SERIAL,
    TicketId int NOT NULL,
    WarehouseOrder int NOT NULL,
    Status varchar NOT NULL DEFAULT 'Processing',
    TrackingNumber varchar DEFAULT 'Not Available'
);

CREATE TABLE WarehouseOrder (
    Id SERIAL,
    TicketId int NOT NULL,
    Quantity int NOT NULL DEFAULT 1,
    Assigneditem int NOT NULL
);
