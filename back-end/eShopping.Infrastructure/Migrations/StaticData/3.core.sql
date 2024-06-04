--
-- Dumping data for `ProductSize`
--

-- Insert "Size" category into ProductSizeCategory table
INSERT INTO [dbo].[ProductSizeCategory] (Id, Name, CreatedUser, CreatedTime, LastSavedUser, LastSavedTime, IsDeleted)
VALUES (NEWID(), 'Size chữ', NULL, GETDATE(), NULL, GETDATE(), 0);
-- Get the Id of the inserted "Size" category
DECLARE @ProductSizeCategoryId UNIQUEIDENTIFIER;
SET @ProductSizeCategoryId = (SELECT Id FROM [dbo].[ProductSizeCategory] WHERE Name = 'Size chữ');
-- Insert sizes into ProductSize table
INSERT INTO [dbo].[ProductSize] (Id, Name, ProductSizeCategoryId, Priority, CreatedUser, CreatedTime, LastSavedUser, LastSavedTime, IsDeleted)
VALUES 
    (NEWID(), 'S', @ProductSizeCategoryId, 1, NULL, GETDATE(), NULL, GETDATE(), 0),
    (NEWID(), 'M', @ProductSizeCategoryId, 2, NULL, GETDATE(), NULL, GETDATE(), 0),
    (NEWID(), 'L', @ProductSizeCategoryId, 3, NULL, GETDATE(), NULL, GETDATE(), 0),
    (NEWID(), 'XL', @ProductSizeCategoryId, 4, NULL, GETDATE(), NULL, GETDATE(), 0),
    (NEWID(), 'XXL', @ProductSizeCategoryId, 5, NULL, GETDATE(), NULL, GETDATE(), 0);


-- Insert "Free-size" category into ProductSizeCategory table
INSERT INTO [dbo].[ProductSizeCategory] (Id, Name, CreatedUser, CreatedTime, LastSavedUser, LastSavedTime, IsDeleted)
VALUES (NEWID(), 'Freesize', NULL, GETDATE(), NULL, GETDATE(), 0);
-- Get the Id of the inserted "Free-size" category
DECLARE @FreesizeCategoryId UNIQUEIDENTIFIER;
SET @FreesizeCategoryId = (SELECT Id FROM [dbo].[ProductSizeCategory] WHERE Name = 'Freesize');
-- Insert the "free-size" into ProductSize table
INSERT INTO [dbo].[ProductSize] (Id, Name, ProductSizeCategoryId, Priority, CreatedUser, CreatedTime, LastSavedUser, LastSavedTime, IsDeleted)
VALUES (NEWID(), 'Free-size', @FreesizeCategoryId, 1, NULL, GETDATE(), NULL, GETDATE(), 0);


INSERT INTO [dbo].[ProductSizeCategory] (Id, Name, CreatedTime, LastSavedTime, IsDeleted)
VALUES (NEWID(), 'Size số', GETDATE(), GETDATE(), 0);
-- Get the Id of the "Size số" category
DECLARE @ProductSizeCategoryIds UNIQUEIDENTIFIER;
SET @ProductSizeCategoryIdS = (SELECT Id FROM [dbo].[ProductSizeCategory] WHERE Name = 'Size số');
-- Insert sizes into ProductSize table if not exist
INSERT INTO [dbo].[ProductSize] (Id, Name, ProductSizeCategoryId, Priority, CreatedUser, CreatedTime, LastSavedUser, LastSavedTime, IsDeleted)
SELECT NEWID(), Name, @ProductSizeCategoryIdS, Priority, NULL, GETDATE(), NULL, GETDATE(), 0
FROM (VALUES ('36', 1), ('37', 2), ('38', 3), ('39', 4), ('40', 5), ('41', 6), ('42', 7), ('43', 8)) AS Sizes(Name, Priority)
WHERE NOT EXISTS (SELECT 1 FROM [dbo].[ProductSize] WHERE Name = Sizes.Name AND ProductSizeCategoryId = @ProductSizeCategoryIdS);


--
-- Dumping data for `ProductRootCategory`
--
-- Insert data into ProductRootCategory table
INSERT INTO [dbo].[ProductRootCategory] (Id, Name, Content, KeywordSEO, UrlSEO, TitleSEO, DescriptionSEO, Description, Priority, GenderProduct, CreatedUser, CreatedTime, LastSavedUser, LastSavedTime, IsDeleted)
VALUES 
    (NEWID(), N'Áo', N'Content for Áo', N'keyword for Áo', 'ao', N'Title for Áo', NULL, NULL, 1, 0, NULL, GETDATE(), NULL, GETDATE(), 0),
    (NEWID(), N'Quần', N'Content for Quần', N'keyword for Quần', 'quan', N'Title for Quần', NULL, NULL, 2, 0, NULL, GETDATE(), NULL, GETDATE(), 0),
    (NEWID(), N'Phụ kiện', N'Content for Phụ kiện', N'keyword for Phụ kiện', 'phu-kien', N'Title for Phụ kiện', NULL, NULL, 3, 0, NULL, GETDATE(), NULL, GETDATE(), 0);

-- Get the Ids of the inserted ProductRootCategories
DECLARE @ProductRootCategoryIdAo UNIQUEIDENTIFIER;
DECLARE @ProductRootCategoryIdQuan UNIQUEIDENTIFIER;
DECLARE @ProductRootCategoryIdPhuKien UNIQUEIDENTIFIER;

SET @ProductRootCategoryIdAo = (SELECT Id FROM [dbo].[ProductRootCategory] WHERE Name = N'Áo');
SET @ProductRootCategoryIdQuan = (SELECT Id FROM [dbo].[ProductRootCategory] WHERE Name = N'Quần');
SET @ProductRootCategoryIdPhuKien = (SELECT Id FROM [dbo].[ProductRootCategory] WHERE Name = N'Phụ kiện');

-- Insert data into ProductCategory table
INSERT INTO [dbo].[ProductCategory] (Id, Name, Content, KeywordSEO, UrlSEO, TitleSEO, DescriptionSEO, Description, Priority, GenderProduct, ProductRootCategoryId, CreatedUser, CreatedTime, LastSavedUser, LastSavedTime, IsDeleted)
VALUES 
    -- Categories under "Áo"
    (NEWID(), N'Áo thun', NULL, NULL, 'ao-thun', NULL, NULL, NULL, 1, 0, @ProductRootCategoryIdAo, NULL, GETDATE(), NULL, GETDATE(), 0),
    (NEWID(), N'Áo sơ mi', NULL, NULL, 'ao-so-mi', NULL, NULL, NULL, 2, 0, @ProductRootCategoryIdAo, NULL, GETDATE(), NULL, GETDATE(), 0),
    (NEWID(), N'Áo polo', NULL, NULL, 'ao-polo', NULL, NULL, NULL, 3, 0, @ProductRootCategoryIdAo, NULL, GETDATE(), NULL, GETDATE(), 0),
    (NEWID(), N'Áo thể thao', NULL, NULL, 'ao-the-thao', NULL, NULL, NULL, 4, 0, @ProductRootCategoryIdAo, NULL, GETDATE(), NULL, GETDATE(), 0),
    (NEWID(), N'Áo croptop', NULL, NULL, 'ao-croptop', NULL, NULL, NULL, 5, 2, @ProductRootCategoryIdAo, NULL, GETDATE(), NULL, GETDATE(), 0),

    -- Categories under "Quần"
    (NEWID(), N'Quần short', NULL, NULL, 'quan-short', NULL, NULL, NULL, 1, 0, @ProductRootCategoryIdQuan, NULL, GETDATE(), NULL, GETDATE(), 0),
    (NEWID(), N'Quần jean', NULL, NULL, 'quan-jean', NULL, NULL, NULL, 2, 0, @ProductRootCategoryIdQuan, NULL, GETDATE(), NULL, GETDATE(), 0),
    (NEWID(), N'Quần tây', NULL, NULL, 'quan-tay', NULL, NULL, NULL, 3, 0, @ProductRootCategoryIdQuan, NULL, GETDATE(), NULL, GETDATE(), 0),
    (NEWID(), N'Đầm', NULL, NULL, 'dam', NULL, NULL, NULL, 4, 2, @ProductRootCategoryIdQuan, NULL, GETDATE(), NULL, GETDATE(), 0),
    (NEWID(), N'Váy', NULL, NULL, 'vay', NULL, NULL, NULL, 5, 2, @ProductRootCategoryIdQuan, NULL, GETDATE(), NULL, GETDATE(), 0),
    (NEWID(), N'Chân váy', NULL, NULL, 'chan-vay', NULL, NULL, NULL, 6, 2, @ProductRootCategoryIdQuan, NULL, GETDATE(), NULL, GETDATE(), 0),

	(NEWID(), N'Túi', NULL, NULL, 'tui', NULL, NULL, NULL, 1, 0, @ProductRootCategoryIdPhuKien, NULL, GETDATE(), NULL, GETDATE(), 0),
    (NEWID(), N'Kính', NULL, NULL, 'kinh', NULL, NULL, NULL, 2, 0, @ProductRootCategoryIdPhuKien, NULL, GETDATE(), NULL, GETDATE(), 0),
    (NEWID(), N'Mũ', NULL, NULL, 'mu', NULL, NULL, NULL, 3, 0, @ProductRootCategoryIdPhuKien, NULL, GETDATE(), NULL, GETDATE(), 0);