USE eshoppingdb
--
-- Dumping data for table `Permission`
--
DELETE [dbo].[Permission]

INSERT INTO [dbo].[Permission] (Id, PermissionGroupId, Name, Description, IsDeleted)
VALUES
('6C626154-5065-7265-6D69-737300000001','6C626154-5065-7265-6D69-937300000001','Admin', '',0),

('6C626154-5065-7265-6D69-737300000002','6C626154-5065-7265-6D69-937300000002','View product', '',0),
('6C626154-5065-7265-6D69-737300000003','6C626154-5065-7265-6D69-937300000002','Create product', '',0),
('6C626154-5065-7265-6D69-737300000004','6C626154-5065-7265-6D69-937300000002','Edit product', '',0),

('6C626154-5065-7265-6D69-737300000005','6C626154-5065-7265-6D69-937300000003','View product category', '',0),
('6C626154-5065-7265-6D69-737300000006','6C626154-5065-7265-6D69-937300000003','Create product category', '',0),
('6C626154-5065-7265-6D69-737300000007','6C626154-5065-7265-6D69-937300000003','Edit product category', '',0),

('6C626154-5065-7265-6D69-737300000008','6C626154-5065-7265-6D69-937300000004','View customer', '',0),
('6C626154-5065-7265-6D69-737300000009','6C626154-5065-7265-6D69-937300000004','Create customer', '',0),
('6C626154-5065-7265-6D69-73730000000A','6C626154-5065-7265-6D69-937300000004','Edit customer', '',0),

('6C626154-5065-7265-6D69-73730000000B','6C626154-5065-7265-6D69-937300000005','View staff', '',0),
('6C626154-5065-7265-6D69-73730000000C','6C626154-5065-7265-6D69-937300000005','Create staff', '',0),
('6C626154-5065-7265-6D69-73730000000D','6C626154-5065-7265-6D69-937300000005','Edit staff', '',0),

('6C626154-5065-7265-6D69-73730000000E','6C626154-5065-7265-6D69-937300000006','View order', '',0),
('6C626154-5065-7265-6D69-73730000000F','6C626154-5065-7265-6D69-937300000006','Create order', '',0),
('6C626154-5065-7265-6D69-737300000010','6C626154-5065-7265-6D69-937300000006','Edit order', '',0),

('6C626154-5065-7265-6D69-737300000011','6C626154-5065-7265-6D69-937300000007','View blog', '',0),
('6C626154-5065-7265-6D69-737300000012','6C626154-5065-7265-6D69-937300000007','Create blog', '',0),
('6C626154-5065-7265-6D69-737300000013','6C626154-5065-7265-6D69-937300000007','Edit blog', '',0),

-- STORE WEB
('6C626154-5065-7265-6D69-737300000100','6C626154-5065-7265-6D69-937300000100','Store web', '',0)
GO
