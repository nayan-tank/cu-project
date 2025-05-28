imageUploadUtil = async function imageUploadUtil(file) {
  if (!file || !file.path) {
    throw new Error("Invalid file data");
  }

  return {
    filePath: file.path,
    message: "File uploaded successfully",
  };
}
  


module.exports = imageUploadUtil;