-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: fek_sales
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned DEFAULT NULL,
  `action` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entity_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `entity_id` bigint unsigned DEFAULT NULL,
  `old_values` json DEFAULT NULL,
  `new_values` json DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `audit_logs_user_id_foreign` (`user_id`),
  KEY `audit_logs_entity_type_entity_id_index` (`entity_type`,`entity_id`),
  KEY `audit_logs_created_at_index` (`created_at`),
  CONSTRAINT `audit_logs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_logs`
--

LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
INSERT INTO `audit_logs` VALUES (1,NULL,'receipt.created','Receipt',2,NULL,'{\"items_count\": 3, \"final_amount\": 45, \"receipt_number\": \"REC-2025-000001\"}','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36','2025-10-01 13:50:38','2025-10-01 13:50:38'),(2,NULL,'receipt.created','Receipt',3,NULL,'{\"items_count\": 1, \"final_amount\": 10, \"receipt_number\": \"REC-2025-000002\"}','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36','2025-10-01 13:55:54','2025-10-01 13:55:54'),(3,NULL,'receipt.created','Receipt',4,NULL,'{\"items_count\": 1, \"final_amount\": 21, \"receipt_number\": \"REC-2025-000003\"}','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36','2025-10-01 13:56:36','2025-10-01 13:56:36'),(4,NULL,'receipt.created','Receipt',5,NULL,'{\"items_count\": 1, \"final_amount\": 23, \"receipt_number\": \"REC-2025-000004\"}','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36','2025-10-01 14:05:06','2025-10-01 14:05:06'),(5,NULL,'receipt.created','Receipt',6,NULL,'{\"items_count\": 1, \"final_amount\": 3, \"receipt_number\": \"REC-2025-000005\"}','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36','2025-10-01 14:05:46','2025-10-01 14:05:46'),(6,NULL,'receipt.created','Receipt',7,NULL,'{\"items_count\": 1, \"final_amount\": 50, \"receipt_number\": \"REC-2025-000006\"}','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36','2025-10-01 14:18:15','2025-10-01 14:18:15'),(7,NULL,'receipt.created','Receipt',8,NULL,'{\"items_count\": 3, \"final_amount\": 143, \"receipt_number\": \"REC-2025-000007\"}','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36','2025-10-02 04:24:41','2025-10-02 04:24:41'),(8,NULL,'receipt.created','Receipt',9,NULL,'{\"items_count\": 1, \"final_amount\": 20, \"receipt_number\": \"REC-2025-000008\"}','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36','2025-10-02 04:26:59','2025-10-02 04:26:59'),(9,NULL,'receipt.created','Receipt',10,NULL,'{\"items_count\": 2, \"final_amount\": 52, \"receipt_number\": \"REC-2025-000009\"}','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:142.0) Gecko/20100101 Firefox/142.0','2025-10-02 05:24:01','2025-10-02 05:24:01'),(10,NULL,'receipt.created','Receipt',11,NULL,'{\"items_count\": 3, \"final_amount\": 88, \"receipt_number\": \"REC-2025-000010\"}','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36','2025-10-02 06:27:06','2025-10-02 06:27:06'),(11,NULL,'receipt.created','Receipt',12,NULL,'{\"items_count\": 3, \"final_amount\": 74, \"receipt_number\": \"REC-2025-000011\"}','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36','2025-10-02 06:58:14','2025-10-02 06:58:14'),(12,NULL,'receipt.created','Receipt',13,NULL,'{\"items_count\": 2, \"final_amount\": 31, \"receipt_number\": \"REC-2025-000012\"}','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:142.0) Gecko/20100101 Firefox/142.0','2025-10-03 03:14:21','2025-10-03 03:14:21'),(13,NULL,'receipt.created','Receipt',14,NULL,'{\"items_count\": 2, \"final_amount\": 26, \"receipt_number\": \"REC-2025-000013\"}','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:142.0) Gecko/20100101 Firefox/142.0','2025-10-03 03:43:41','2025-10-03 03:43:41'),(14,NULL,'receipt.created','Receipt',15,NULL,'{\"items_count\": 2, \"final_amount\": 37, \"receipt_number\": \"REC-2025-000014\"}','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:142.0) Gecko/20100101 Firefox/142.0','2025-10-08 06:09:13','2025-10-08 06:09:13');
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fek_cache`
--

DROP TABLE IF EXISTS `fek_cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fek_cache` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `fek_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fek_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fek_date` date NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_pages` int NOT NULL,
  `color_pages` int NOT NULL DEFAULT '0',
  `maps_count` int NOT NULL DEFAULT '0',
  `has_images` tinyint(1) NOT NULL DEFAULT '0',
  `pdf_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `cached_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `fek_cache_fek_number_fek_type_fek_date_unique` (`fek_number`,`fek_type`,`fek_date`),
  KEY `fek_cache_fek_date_index` (`fek_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fek_cache`
--

LOCK TABLES `fek_cache` WRITE;
/*!40000 ALTER TABLE `fek_cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `fek_cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_users_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'0001_01_01_000002_create_jobs_table',1),(4,'2025_10_01_111022_create_fek_sales_tables',1),(5,'2025_10_01_143602_update_receipt_items_item_type_enum',2),(6,'2025_10_01_143612_update_receipt_items_item_type_enum',2),(7,'2025_10_01_172154_add_other_type_to_receipt_items',3);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pricing_rules`
--

DROP TABLE IF EXISTS `pricing_rules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pricing_rules` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fek_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price_per_page` decimal(10,2) NOT NULL,
  `price_per_color_page` decimal(10,2) DEFAULT NULL,
  `price_per_map` decimal(10,2) DEFAULT NULL,
  `minimum_price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `priority` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pricing_rules`
--

LOCK TABLES `pricing_rules` WRITE;
/*!40000 ALTER TABLE `pricing_rules` DISABLE KEYS */;
/*!40000 ALTER TABLE `pricing_rules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_categories`
--

DROP TABLE IF EXISTS `product_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `base_price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `product_categories_code_unique` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_categories`
--

LOCK TABLES `product_categories` WRITE;
/*!40000 ALTER TABLE `product_categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `category_id` bigint unsigned NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `price` decimal(10,2) NOT NULL,
  `stock` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `products_code_unique` (`code`),
  KEY `products_category_id_foreign` (`category_id`),
  CONSTRAINT `products_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `product_categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `receipt_items`
--

DROP TABLE IF EXISTS `receipt_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `receipt_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `receipt_id` bigint unsigned NOT NULL,
  `item_type` enum('fek','book','cd','product','other') COLLATE utf8mb4_unicode_ci NOT NULL,
  `fek_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fek_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fek_date` date DEFAULT NULL,
  `fek_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `total_pages` int DEFAULT NULL,
  `color_pages` int DEFAULT NULL,
  `maps_count` int DEFAULT NULL,
  `product_id` bigint unsigned DEFAULT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `unit_price` decimal(10,2) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `price_manually_adjusted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `receipt_items_receipt_id_foreign` (`receipt_id`),
  KEY `receipt_items_product_id_foreign` (`product_id`),
  CONSTRAINT `receipt_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL,
  CONSTRAINT `receipt_items_receipt_id_foreign` FOREIGN KEY (`receipt_id`) REFERENCES `receipts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `receipt_items`
--

LOCK TABLES `receipt_items` WRITE;
/*!40000 ALTER TABLE `receipt_items` DISABLE KEYS */;
INSERT INTO `receipt_items` VALUES (2,2,'fek','345/Α/2024','A','2025-10-01','Κανονισμός για την προστασία προσωπικών δεδομένων',25,5,0,NULL,'Κανονισμός για την προστασία προσωπικών δεδομένων - ΦΕΚ 345/Α/2024',1,10.00,10.00,0,'2025-10-01 13:50:38','2025-10-01 13:50:38'),(3,2,'book',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Biblio 1 - Συγγραφέας: Άγνωστος',1,23.00,23.00,0,'2025-10-01 13:50:38','2025-10-01 13:50:38'),(4,2,'cd',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'CD3 - Καλλιτέχνης: Άγνωστος',1,12.00,12.00,0,'2025-10-01 13:50:38','2025-10-01 13:50:38'),(5,3,'fek','345/Α/2024','A','2025-10-01','Κανονισμός για την προστασία προσωπικών δεδομένων',25,5,0,NULL,'Κανονισμός για την προστασία προσωπικών δεδομένων - ΦΕΚ 345/Α/2024',1,10.00,10.00,1,'2025-10-01 13:55:54','2025-10-01 13:55:54'),(6,4,'fek','345/Α/2024','A','2025-10-01','Κανονισμός για την προστασία προσωπικών δεδομένων',25,5,0,NULL,'Κανονισμός για την προστασία προσωπικών δεδομένων - ΦΕΚ 345/Α/2024',1,21.00,21.00,1,'2025-10-01 13:56:36','2025-10-01 13:56:36'),(7,5,'fek','345/Α/2024','A','2025-10-01','Κανονισμός για την προστασία προσωπικών δεδομένων',25,5,0,NULL,'Κανονισμός για την προστασία προσωπικών δεδομένων - ΦΕΚ 345/Α/2024',1,23.00,23.00,1,'2025-10-01 14:05:06','2025-10-01 14:05:06'),(8,6,'fek','345/Α/2024','A','2025-10-01','Κανονισμός για την προστασία προσωπικών δεδομένων',25,5,0,NULL,'Κανονισμός για την προστασία προσωπικών δεδομένων - ΦΕΚ 345/Α/2024',1,3.00,3.00,1,'2025-10-01 14:05:46','2025-10-01 14:05:46'),(9,7,'fek','345/Α/2024','A','2025-10-01','Κανονισμός για την προστασία προσωπικών δεδομένων',25,5,0,NULL,'Κανονισμός για την προστασία προσωπικών δεδομένων - ΦΕΚ 345/Α/2024',1,50.00,50.00,1,'2025-10-01 14:18:15','2025-10-01 14:18:15'),(10,8,'fek','345/Α/2024','A','2025-10-02','Κανονισμός για την προστασία προσωπικών δεδομένων',25,5,0,NULL,'Κανονισμός για την προστασία προσωπικών δεδομένων - ΦΕΚ 345/Α/2024',1,10.00,10.00,1,'2025-10-02 04:24:41','2025-10-02 04:24:41'),(11,8,'book',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Βιβλίο 1 - Συγγραφέας: Άγνωστος',2,11.00,22.00,0,'2025-10-02 04:24:41','2025-10-02 04:24:41'),(12,8,'other',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Χάρτης Αττικής - Κατηγορία: Άλλο',1,111.00,111.00,0,'2025-10-02 04:24:41','2025-10-02 04:24:41'),(13,9,'fek','345/Α/2024','A','2025-10-02','Κανονισμός για την προστασία προσωπικών δεδομένων',25,5,0,NULL,'Κανονισμός για την προστασία προσωπικών δεδομένων - ΦΕΚ 345/Α/2024',1,20.00,20.00,1,'2025-10-02 04:26:59','2025-10-02 04:26:59'),(14,10,'fek','345/Α/2024','A','2025-10-02','Κανονισμός για την προστασία προσωπικών δεδομένων',25,5,0,NULL,'Κανονισμός για την προστασία προσωπικών δεδομένων - ΦΕΚ 345/Α/2024',1,10.00,10.00,1,'2025-10-02 05:24:01','2025-10-02 05:24:01'),(15,10,'book',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Βιβλιο 1 - Συγγραφέας: Άγνωστος',2,21.00,42.00,0,'2025-10-02 05:24:01','2025-10-02 05:24:01'),(16,11,'fek','345/Α/2024','A','2025-10-02','Κανονισμός για την προστασία προσωπικών δεδομένων',25,5,0,NULL,'Κανονισμός για την προστασία προσωπικών δεδομένων - ΦΕΚ 345/Α/2024',1,20.00,20.00,1,'2025-10-02 06:27:06','2025-10-02 06:27:06'),(17,11,'book',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Βι1 - Συγγραφέας: Άγνωστος',3,22.00,66.00,0,'2025-10-02 06:27:06','2025-10-02 06:27:06'),(18,11,'cd',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'δδδ - Καλλιτέχνης: Άγνωστος',1,2.00,2.00,0,'2025-10-02 06:27:06','2025-10-02 06:27:06'),(19,12,'fek','345/Α/2024','A','2025-10-02','Κανονισμός για την προστασία προσωπικών δεδομένων',25,5,0,NULL,'Κανονισμός για την προστασία προσωπικών δεδομένων - ΦΕΚ 345/Α/2024',1,20.00,20.00,1,'2025-10-02 06:58:14','2025-10-02 06:58:14'),(20,12,'book',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'dsdde - Συγγραφέας: Άγνωστος',1,22.00,22.00,0,'2025-10-02 06:58:14','2025-10-02 06:58:14'),(21,12,'cd',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'333 - Καλλιτέχνης: Άγνωστος',1,32.00,32.00,0,'2025-10-02 06:58:14','2025-10-02 06:58:14'),(22,13,'fek','345/Α/2024','A','2025-10-03','Κανονισμός για την προστασία προσωπικών δεδομένων',25,5,0,NULL,'Κανονισμός για την προστασία προσωπικών δεδομένων - ΦΕΚ 345/Α/2024',1,20.00,20.00,1,'2025-10-03 03:14:21','2025-10-03 03:14:21'),(23,13,'book',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'swss - Συγγραφέας: Άγνωστος',1,11.00,11.00,0,'2025-10-03 03:14:21','2025-10-03 03:14:21'),(24,14,'fek','345/Α/2024','A','2025-10-03','Κανονισμός για την προστασία προσωπικών δεδομένων',25,5,0,NULL,'Κανονισμός για την προστασία προσωπικών δεδομένων - ΦΕΚ 345/Α/2024',1,15.00,15.00,1,'2025-10-03 03:43:41','2025-10-03 03:43:41'),(25,14,'book',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'δδδδ - Συγγραφέας: Άγνωστος',1,11.00,11.00,0,'2025-10-03 03:43:41','2025-10-03 03:43:41'),(26,15,'fek','345/Α/2024','A','2025-10-08','Κανονισμός για την προστασία προσωπικών δεδομένων',25,5,0,NULL,'Κανονισμός για την προστασία προσωπικών δεδομένων - ΦΕΚ 345/Α/2024',1,25.00,25.00,1,'2025-10-08 06:09:13','2025-10-08 06:09:13'),(27,15,'book',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'εεε - Συγγραφέας: Άγνωστος',1,12.00,12.00,0,'2025-10-08 06:09:13','2025-10-08 06:09:13');
/*!40000 ALTER TABLE `receipt_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `receipts`
--

DROP TABLE IF EXISTS `receipts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `receipts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `receipt_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `discount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `final_amount` decimal(10,2) NOT NULL,
  `status` enum('completed','cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'completed',
  `cancelled_at` timestamp NULL DEFAULT NULL,
  `cancelled_by` bigint unsigned DEFAULT NULL,
  `cancellation_reason` text COLLATE utf8mb4_unicode_ci,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `receipts_receipt_number_unique` (`receipt_number`),
  KEY `receipts_user_id_foreign` (`user_id`),
  KEY `receipts_cancelled_by_foreign` (`cancelled_by`),
  CONSTRAINT `receipts_cancelled_by_foreign` FOREIGN KEY (`cancelled_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `receipts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `receipts`
--

LOCK TABLES `receipts` WRITE;
/*!40000 ALTER TABLE `receipts` DISABLE KEYS */;
INSERT INTO `receipts` VALUES (2,'REC-2025-000001',1,45.00,0.00,45.00,'completed',NULL,NULL,NULL,NULL,'2025-10-01 13:50:38','2025-10-01 13:50:38',NULL),(3,'REC-2025-000002',1,10.00,0.00,10.00,'completed',NULL,NULL,NULL,NULL,'2025-10-01 13:55:54','2025-10-01 13:55:54',NULL),(4,'REC-2025-000003',1,21.00,0.00,21.00,'completed',NULL,NULL,NULL,NULL,'2025-10-01 13:56:36','2025-10-01 13:56:36',NULL),(5,'REC-2025-000004',1,23.00,0.00,23.00,'completed',NULL,NULL,NULL,NULL,'2025-10-01 14:05:06','2025-10-01 14:05:06',NULL),(6,'REC-2025-000005',1,3.00,0.00,3.00,'completed',NULL,NULL,NULL,NULL,'2025-10-01 14:05:46','2025-10-01 14:05:46',NULL),(7,'REC-2025-000006',1,50.00,0.00,50.00,'completed',NULL,NULL,NULL,NULL,'2025-10-01 14:18:15','2025-10-01 14:18:15',NULL),(8,'REC-2025-000007',1,143.00,0.00,143.00,'completed',NULL,NULL,NULL,NULL,'2025-10-02 04:24:41','2025-10-02 04:24:41',NULL),(9,'REC-2025-000008',1,20.00,0.00,20.00,'completed',NULL,NULL,NULL,NULL,'2025-10-02 04:26:59','2025-10-02 04:26:59',NULL),(10,'REC-2025-000009',1,52.00,0.00,52.00,'completed',NULL,NULL,NULL,NULL,'2025-10-02 05:24:01','2025-10-02 05:24:01',NULL),(11,'REC-2025-000010',1,88.00,0.00,88.00,'completed',NULL,NULL,NULL,NULL,'2025-10-02 06:27:06','2025-10-02 06:27:06',NULL),(12,'REC-2025-000011',1,74.00,0.00,74.00,'completed',NULL,NULL,NULL,NULL,'2025-10-02 06:58:14','2025-10-02 06:58:14',NULL),(13,'REC-2025-000012',1,31.00,0.00,31.00,'completed',NULL,NULL,NULL,NULL,'2025-10-03 03:14:21','2025-10-03 03:14:21',NULL),(14,'REC-2025-000013',1,26.00,0.00,26.00,'completed',NULL,NULL,NULL,NULL,'2025-10-03 03:43:41','2025-10-03 03:43:41',NULL),(15,'REC-2025-000014',1,37.00,0.00,37.00,'completed',NULL,NULL,NULL,NULL,'2025-10-08 06:09:13','2025-10-08 06:09:13',NULL);
/*!40000 ALTER TABLE `receipts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('admin','operator') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'operator',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `ldap_dn` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_username_unique` (`username`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','admin@et.gr','Διαχειριστής Συστήματος','admin',1,NULL,NULL,'2025-10-01 08:11:43','2025-10-01 08:11:43',NULL),(2,'operator1','operator1@et.gr','Χειριστής Πωλήσεων','operator',1,NULL,NULL,'2025-10-01 08:11:43','2025-10-01 08:11:43',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-28 14:15:35
