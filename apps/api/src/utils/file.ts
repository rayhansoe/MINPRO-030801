import { unlink, unlinkSync } from "fs";

export async function deleteFile(filePath: string) {
  filePath = `./public/images/${filePath}`
  console.log(filePath, 'AKU DISINI');
  try {
    await unlink(filePath, (err) => {
      throw err
    });
    
    console.log(`File ${filePath} has been deleted.`);
  } catch (err) {
    console.error(err);
  }
}