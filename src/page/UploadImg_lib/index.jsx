import React, { useState, useEffect } from "react";
import { Upload, message } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
}

const UploadImg_lib = () => {
  const [imageUrl, setImageUrl] = useState();
  const [loading, setLoading] = useState(false);

  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl) => {
        setImageUrl(imageUrl);
        setLoading(false);
      });
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const handlePaste = (e) => {
    console.log("zhantie");
    let items = e.clipboardData.items;
    console.log("items", items);
    // 这是一个类数组对象！！！不是数组，不能用map和forEach遍历
    // 可以用for...of 遍历是因为其内部实现了可迭代协议
    for (let item of items) {
      // 这一步很重要，因为直接把item打印出来是看不到具体内容的（如上图），需要遍历它
      if (item.kind === "file") {
        // 取得文件对象，一切好办
        var pasteFile = item.getAsFile();
        // formData格式
        let formData = new FormData();
        // 需要token
        // formData.append("token", this.dataObj.token);
        formData.append("file", pasteFile);
        // 上传文件
        fetch("./file.php", {
          method: "POST",
          headers: {},
          body: formData,
        }).then(function (response) {
          console.log("response", response);
          // 设置图片就可以了
          return response.json();
        });
      }
    }
  };

  useEffect(() => {
    window.addEventListener("paste", handlePaste);
  }, []);
  return (
    <Upload
      name="avatar"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
      beforeUpload={beforeUpload}
      onChange={handleChange}
    >
      {imageUrl ? (
        <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
      ) : (
        uploadButton
      )}
    </Upload>
  );
};

export default UploadImg_lib;
