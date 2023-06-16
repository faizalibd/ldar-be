const fs = require("fs");
const { join } = require("path");

exports.create_dir = (folder, dir) => {
  let directory;
  if (folder) {
    directory = join(process.env.FILE_DIR, folder);
  } else {
    directory = dir;
  }
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  return directory;
};

exports.create_file = (dir, file, file_originalname) => {
  let upload_dir = this.create_dir("", dir);
  let buffer = file.buffer;
  let namafile = file_originalname ? file_originalname : file.originalname;

  fs.writeFileSync(join(upload_dir, namafile), buffer);
};

exports.delete_file = (dir, namafile, delete_folder) => {
  let upload_dir = this.create_dir("", dir);
  if (fs.existsSync(join(upload_dir, namafile))) {
    if (namafile) {
      fs.unlinkSync(join(upload_dir, namafile));
      if (delete_folder && fs.existsSync(upload_dir)) {
        fs.rmdirSync(upload_dir);
      }
    } else {
      fs.rmSync(upload_dir, { recursive: true, force: true });
    }
  }
};

exports.download_file = (dir, namafile) => {
  let download = join(this.create_dir("", dir), namafile);
  return fs.existsSync(download) ? download : false;
};

exports.convert_meta_data = async (meta_data) => {
  const result = await Promise.all(
    meta_data.map(async (d) => {
      let name = (
        await Promise.all(
          d.split("_").map((word) => {
            return word[0].toUpperCase() + word.substring(1);
          })
        )
      ).join(" ");
      switch (d) {
        case "x":
          name = "X";
          break;
      }

      return { kode: d, nama: name };
    })
  );

  return result;
};

exports.create_file_excel = async (workbook, namafile) => {
  let upload_dir = this.create_dir("Excel");
  let path = join(upload_dir, namafile);
  await workbook.xlsx.writeFile(path);
};
