USE eshoppingdb
--
-- Dumping data for table `PermissionGroup`
--
DELETE [dbo].[PermissionGroup]

GO
INSERT INTO [dbo].[PermissionGroup] (Id, Name, IsDeleted)
VALUES
('6C626154-5065-7265-6D69-937300000001','ADMIN',0),
('6C626154-5065-7265-6D69-937300000002','PRODUCT',0),
('6C626154-5065-7265-6D69-937300000003','CATEGORY',0),
('6C626154-5065-7265-6D69-937300000004','CUSTOMER',0),
('6C626154-5065-7265-6D69-937300000005','STAFF',0),
('6C626154-5065-7265-6D69-937300000006','ORDER',0),
('6C626154-5065-7265-6D69-937300000007','BLOG',0),

-- STORE WEB
('6C626154-5065-7265-6D69-937300000100','STOREWEB',0)
GO
