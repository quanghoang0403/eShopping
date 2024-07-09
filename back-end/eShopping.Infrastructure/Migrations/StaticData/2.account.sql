--
-- Dumping data for table `PermissionGroup`
--
DELETE [dbo].[PermissionGroup]

GO
INSERT INTO [dbo].[PermissionGroup] (Id, Name, IsDeleted, IsActive)
VALUES
('6C626154-5065-7265-6D69-937300000001','ADMIN',0,1),
('6C626154-5065-7265-6D69-937300000002','PRODUCT',0,1),
('6C626154-5065-7265-6D69-937300000003','CATEGORY',0,1),
('6C626154-5065-7265-6D69-937300000004','CUSTOMER',0,1),
('6C626154-5065-7265-6D69-937300000005','STAFF',0,1),
('6C626154-5065-7265-6D69-937300000006','ORDER',0,1),
('6C626154-5065-7265-6D69-937300000007','BLOG',0,1),

-- STORE WEB
('6C626154-5065-7265-6D69-937300000100','STOREWEB',0,1)
GO


--
-- Dumping data for table `Permission`
--
DELETE [dbo].[Permission]

INSERT INTO [dbo].[Permission] (Id, PermissionGroupId, Name, Description, IsDeleted, IsActive)
VALUES
('6C626154-5065-7265-6D69-737300000001','6C626154-5065-7265-6D69-937300000001','Admin', '',0,1),

('6C626154-5065-7265-6D69-737300000002','6C626154-5065-7265-6D69-937300000002','View product', '',0,1),
('6C626154-5065-7265-6D69-737300000003','6C626154-5065-7265-6D69-937300000002','Create product', '',0,1),
('6C626154-5065-7265-6D69-737300000004','6C626154-5065-7265-6D69-937300000002','Edit product', '',0,1),

('6C626154-5065-7265-6D69-737300000005','6C626154-5065-7265-6D69-937300000003','View product category', '',0,1),
('6C626154-5065-7265-6D69-737300000006','6C626154-5065-7265-6D69-937300000003','Create product category', '',0,1),
('6C626154-5065-7265-6D69-737300000007','6C626154-5065-7265-6D69-937300000003','Edit product category', '',0,1),

('6C626154-5065-7265-6D69-737300000008','6C626154-5065-7265-6D69-937300000004','View customer', '',0,1),
('6C626154-5065-7265-6D69-737300000009','6C626154-5065-7265-6D69-937300000004','Create customer', '',0,1),
('6C626154-5065-7265-6D69-73730000000A','6C626154-5065-7265-6D69-937300000004','Edit customer', '',0,1),

('6C626154-5065-7265-6D69-73730000000B','6C626154-5065-7265-6D69-937300000005','View staff', '',0,1),
('6C626154-5065-7265-6D69-73730000000C','6C626154-5065-7265-6D69-937300000005','Create staff', '',0,1),
('6C626154-5065-7265-6D69-73730000000D','6C626154-5065-7265-6D69-937300000005','Edit staff', '',0,1),

('6C626154-5065-7265-6D69-73730000000E','6C626154-5065-7265-6D69-937300000006','View order', '',0,1),
('6C626154-5065-7265-6D69-73730000000F','6C626154-5065-7265-6D69-937300000006','Create order', '',0,1),
('6C626154-5065-7265-6D69-737300000010','6C626154-5065-7265-6D69-937300000006','Edit order', '',0,1),

('6C626154-5065-7265-6D69-737300000011','6C626154-5065-7265-6D69-937300000007','View blog', '',0,1),
('6C626154-5065-7265-6D69-737300000012','6C626154-5065-7265-6D69-937300000007','Create blog', '',0,1),
('6C626154-5065-7265-6D69-737300000013','6C626154-5065-7265-6D69-937300000007','Edit blog', '',0,1),

-- STORE WEB
('6C626154-5065-7265-6D69-737300000100','6C626154-5065-7265-6D69-937300000100','Store web', '',0,1)
GO


--
-- Dumping data for `Admin Staff`
--
DELETE [dbo].[Account]
INSERT INTO [dbo].[Account] VALUES ('72F6ED92-6455-47BA-F051-08DC38D2DCAA','admin@gmail.com','AQAAAAIAAYagAAAAECzOgI3+Ec8ikp0SPa7stODQ5MIUi24Dsf5/3Xc5iLr/pbpFPZtu4TZGtriFzbxuUw==', '1', 0, '0946290739', 'Admin', 'https://vcdn-giaitri.vnecdn.net/2023/05/05/son-tung-mmw-2824-1683249980.jpg', null, 1, 1, null, null, null, null, 0, 1)

DELETE [dbo].[Staff]
INSERT INTO [dbo].[Staff] VALUES ('BE5D67BB-8E87-46DF-3F74-08DC38D2DCB8', '72F6ED92-6455-47BA-F051-08DC38D2DCAA', null, null, null, null, null, 0, 1)

DELETE [dbo].[StaffPermission]
INSERT INTO [dbo].[StaffPermission] VALUES ('91CBC18B-F310-4C62-8FE3-08DC38D2DCEB', 'BE5D67BB-8E87-46DF-3F74-08DC38D2DCB8', '6C626154-5065-7265-6D69-737300000001', null, null, null, null, 0, 1)
 

--
-- Dumping data for `Customer`
--
INSERT INTO [dbo].[Account] VALUES ('B9535619-CB83-48C1-8B29-C7BB1042150A','customer@gmail.com','AQAAAAIAAYagAAAAECzOgI3+Ec8ikp0SPa7stODQ5MIUi24Dsf5/3Xc5iLr/pbpFPZtu4TZGtriFzbxuUw==', '1', 0, '0946290739', 'Customer', 'https://vcdn-giaitri.vnecdn.net/2023/05/05/son-tung-mmw-2824-1683249980.jpg', null, 1, 0, null, null, null, null, 0, 1)

DELETE [dbo].Customer
INSERT INTO [dbo].[Customer] VALUES ('9FC33608-3170-490E-9408-586E1EE6BC09', 'B9535619-CB83-48C1-8B29-C7BB1042150A', 1, 3, 33, '198 Dien Bien Phu', null, null, null, null, null, 0, 1)
 