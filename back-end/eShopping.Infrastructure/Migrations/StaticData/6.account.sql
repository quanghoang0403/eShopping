USE eshoppingdb
--
-- Dumping data for `Admin Staff`
--
DELETE [dbo].[Account]
INSERT INTO [dbo].[Account] VALUES ('72F6ED92-6455-47BA-F051-08DC38D2DCAA','admin@gmail.com','AQAAAAIAAYagAAAAECzOgI3+Ec8ikp0SPa7stODQ5MIUi24Dsf5/3Xc5iLr/pbpFPZtu4TZGtriFzbxuUw==', '1', 0, '0946290739', 'Admin', 'https://vcdn-giaitri.vnecdn.net/2023/05/05/son-tung-mmw-2824-1683249980.jpg', null, 1, 1, null, null, null, null, 0)

DELETE [dbo].[Staff]
INSERT INTO [dbo].[Staff] VALUES ('BE5D67BB-8E87-46DF-3F74-08DC38D2DCB8', '72F6ED92-6455-47BA-F051-08DC38D2DCAA', null, null, null, null, null, 0)

DELETE [dbo].[StaffPermissionGroup]
INSERT INTO [dbo].[StaffPermissionGroup] VALUES ('91CBC18B-F310-4C62-8FE3-08DC38D2DCEB', 'BE5D67BB-8E87-46DF-3F74-08DC38D2DCB8', '6C626154-5065-7265-6D69-937300000001', null, null, null, null, 0)
 

--
-- Dumping data for `Customer`
--
INSERT INTO [dbo].[Account] VALUES ('B9535619-CB83-48C1-8B29-C7BB1042150A','customer@gmail.com','AQAAAAIAAYagAAAAECzOgI3+Ec8ikp0SPa7stODQ5MIUi24Dsf5/3Xc5iLr/pbpFPZtu4TZGtriFzbxuUw==', '1', 0, '0946290739', 'Customer', 'https://vcdn-giaitri.vnecdn.net/2023/05/05/son-tung-mmw-2824-1683249980.jpg', null, 1, 1, null, null, null, null, 0)

DELETE [dbo].Customer
INSERT INTO [dbo].[Customer] VALUES ('9FC33608-3170-490E-9408-586E1EE6BC09', 'B9535619-CB83-48C1-8B29-C7BB1042150A', 1, 3, 33, '198 Dien Bien Phu', null, null, null, null, null, 0)
 