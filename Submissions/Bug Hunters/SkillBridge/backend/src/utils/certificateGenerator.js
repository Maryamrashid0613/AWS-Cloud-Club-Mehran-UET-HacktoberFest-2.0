const fs = require('fs');
const path = require('path');
const { createCanvas, registerFont } = require('canvas');

// Register custom fonts (optional)
// registerFont(path.join(__dirname, '../assets/fonts/OpenSans-Regular.ttf'), { family: 'OpenSans' });

const generateCertificate = async (studentName, courseName, completionDate, instructorName) => {
  try {
    // Create canvas
    const width = 800;
    const height = 600;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Border
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 8;
    ctx.strokeRect(40, 40, width - 80, height - 80);

    // Title
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('CERTIFICATE OF COMPLETION', width / 2, 120);

    // Subtitle
    ctx.font = '24px Arial';
    ctx.fillText('This is to certify that', width / 2, 180);

    // Student name
    ctx.font = 'bold 36px Arial';
    ctx.fillText(studentName, width / 2, 250);

    // Course completion text
    ctx.font = '20px Arial';
    ctx.fillText('has successfully completed the course', width / 2, 300);

    // Course name
    ctx.font = 'bold 28px Arial';
    ctx.fillText(`"${courseName}"`, width / 2, 350);

    // Date
    ctx.font = '18px Arial';
    ctx.fillText(`Completed on: ${completionDate}`, width / 2, 420);

    // Instructor signature area
    ctx.font = '16px Arial';
    ctx.fillText(`Instructor: ${instructorName}`, width / 2, 500);

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `certificate_${timestamp}.png`;
    const filepath = path.join(__dirname, '../uploads/certificates', filename);

    // Ensure directory exists
    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Save certificate
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(filepath, buffer);

    return {
      filename,
      filepath,
      url: `/uploads/certificates/${filename}`
    };
  } catch (error) {
    console.error('Certificate generation error:', error);
    throw new Error('Failed to generate certificate');
  }
};

module.exports = { generateCertificate };
