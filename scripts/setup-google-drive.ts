#!/usr/bin/env tsx

/**
 * Google Drive Database Connection Setup Script
 * 
 * This script automatically connects to Google Drive and initializes the database storage.
 * It verifies the connection and ensures the storage folder and database file are created.
 */

import { getUncachableGoogleDriveClient } from '../server/google-drive-client';
import { GoogleDriveStorage } from '../server/google-drive-storage';

const STORAGE_FOLDER_NAME = 'VisionaryAI_Storage';
const DATA_FILE_NAME = 'database.json';

async function setupGoogleDrive() {
  console.log('🔄 Starting Google Drive database connection setup...\n');

  try {
    // Step 1: Test Google Drive API connection
    console.log('1️⃣ Testing Google Drive API connection...');
    const drive = await getUncachableGoogleDriveClient();
    const about = await drive.about.get({ fields: 'user' });
    console.log(`✅ Connected to Google Drive as: ${about.data.user?.emailAddress}\n`);

    // Step 2: Check for storage folder
    console.log('2️⃣ Checking for storage folder...');
    const folderResponse = await drive.files.list({
      q: `name='${STORAGE_FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: 'files(id, name)',
      spaces: 'drive',
    });

    let folderId: string;
    if (folderResponse.data.files && folderResponse.data.files.length > 0) {
      folderId = folderResponse.data.files[0].id!;
      console.log(`✅ Storage folder found: ${STORAGE_FOLDER_NAME} (ID: ${folderId})\n`);
    } else {
      console.log(`📁 Creating storage folder: ${STORAGE_FOLDER_NAME}...`);
      const fileMetadata = {
        name: STORAGE_FOLDER_NAME,
        mimeType: 'application/vnd.google-apps.folder',
      };
      const folder = await drive.files.create({
        requestBody: fileMetadata,
        fields: 'id',
      });
      folderId = folder.data.id!;
      console.log(`✅ Storage folder created: ${STORAGE_FOLDER_NAME} (ID: ${folderId})\n`);
    }

    // Step 3: Check for database file
    console.log('3️⃣ Checking for database file...');
    const fileResponse = await drive.files.list({
      q: `name='${DATA_FILE_NAME}' and '${folderId}' in parents and trashed=false`,
      fields: 'files(id, name, modifiedTime)',
      spaces: 'drive',
    });

    if (fileResponse.data.files && fileResponse.data.files.length > 0) {
      const file = fileResponse.data.files[0];
      console.log(`✅ Database file found: ${DATA_FILE_NAME} (ID: ${file.id})`);
      console.log(`   Last modified: ${file.modifiedTime}\n`);
    } else {
      console.log(`📄 Database file not found. It will be created on first write.\n`);
    }

    // Step 4: Initialize storage and test
    console.log('4️⃣ Initializing Google Drive storage...');
    const storage = new GoogleDriveStorage();
    
    // Create admin if not exists
    const adminEmail = 'eeweed27ai@admin.com';
    const isAdminExists = await storage.isAdmin(adminEmail);
    
    if (!isAdminExists) {
      console.log(`👤 Creating default admin user: ${adminEmail}...`);
      await storage.createAdmin({
        email: adminEmail,
        username: 'admin',
        password: 'admin123',
      });
      console.log(`✅ Default admin user created\n`);
    } else {
      console.log(`✅ Admin user already exists: ${adminEmail}\n`);
    }

    // Success summary
    console.log('✨ Google Drive database setup completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - Google Drive Account: ${about.data.user?.emailAddress}`);
    console.log(`   - Storage Folder: ${STORAGE_FOLDER_NAME}`);
    console.log(`   - Database File: ${DATA_FILE_NAME}`);
    console.log(`   - Admin Account: ${adminEmail}`);
    console.log('\n🚀 Your application is now configured to use Google Drive for database storage.');
    
    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ Error setting up Google Drive connection:');
    console.error(`   ${error.message}\n`);
    
    if (error.message.includes('not connected')) {
      console.log('💡 Tip: Make sure you have set up the Google Drive integration in Replit.');
      console.log('   1. Go to the Tools panel in Replit');
      console.log('   2. Select "Google Drive" from integrations');
      console.log('   3. Click "Connect" and authorize the connection');
    }
    
    process.exit(1);
  }
}

// Run the setup
setupGoogleDrive();
