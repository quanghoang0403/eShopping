USE eshopping_db
--
-- Dumping data for table `Admin Account`
--
DELETE [dbo].[Account]
INSERT INTO [dbo].[Account] VALUES ('72F6ED92-6455-47BA-F051-08DC38D2DCAA','admin@gmail.com','AQAAAAIAAYagAAAAECzOgI3+Ec8ikp0SPa7stODQ5MIUi24Dsf5/3Xc5iLr/pbpFPZtu4TZGtriFzbxuUw==', '1', 0, '0946290739', 'Admin', 'https://vcdn-giaitri.vnecdn.net/2023/05/05/son-tung-mmw-2824-1683249980.jpg', null, 1, 1, null, null, null, null, 0)

DELETE [dbo].[Staff]
INSERT INTO [dbo].[Staff] VALUES ('BE5D67BB-8E87-46DF-3F74-08DC38D2DCB8', '72F6ED92-6455-47BA-F051-08DC38D2DCAA', null, null, null, null, null, 0)

DELETE [dbo].[StaffPermissionGroup]
INSERT INTO [dbo].[StaffPermissionGroup] VALUES ('91CBC18B-F310-4C62-8FE3-08DC38D2DCEB', 'BE5D67BB-8E87-46DF-3F74-08DC38D2DCB8', '6C626154-5065-7265-6D69-937300000001', null, null, null, null, 0)
 