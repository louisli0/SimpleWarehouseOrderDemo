CREATE TABLE ItemDetails
(
    Id SERIAL,
    Name varchar,
    Category varchar,
    Description varchar
);

CREATE TABLE ItemLocation
(
    Serial SERIAl,
    InventoryId varchar,

)

CREATE TABLE SerialisedItems
(
    Serial SERIAL,
    ItemId int,
    CreatedAt timestamp
);

CREATE TABLE RegisteredItems
(
    Id SERIAL,
    SerialNumber varchar,
    LinkedUser int
);