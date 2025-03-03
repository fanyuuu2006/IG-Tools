import "@/styles/Index/FileUploadSection.css";
import React, { useState } from "react";
import { Upload, Button, UploadFile, Space } from "antd";
import { UploadOutlined } from "@ant-design/icons";

import { HandleJsonFile, NoFollowBackUsers } from "@/lib/HandleFunction";
import { Followers, Following, InstagramData, UserData } from "@/lib/DataTypes";

import { Toast } from "./common/Swal";
import { OutsideLink } from "./common/OutsideLink";
import { DateFromTimeStamp } from "../lib/HandleFunction";

export const FileUploadSection = () => {
  const [Data, setData] = useState<UserData[]>([]);
  const [File1, setFile1] = useState<InstagramData>();
  const [File2, setFile2] = useState<InstagramData>();
  const [FileList1, setFileList1] = useState<UploadFile[]>([]);
  const [FileList2, setFileList2] = useState<UploadFile[]>([]);

  const handleChange1 = async ({ fileList }: { fileList: UploadFile[] }) => {
    try {
      setFileList1(fileList.slice(-1)); // 只保留最後一個
      const file: InstagramData = await HandleJsonFile(
        FileList1[0].originFileObj as File
      );
      setFile1(file);
      Toast.fire({
        icon: "success",
        title: "上傳成功",
      });
    } catch (error) {
      console.log(error);

      Toast.fire({
        icon: "error",
        title: "解析檔案錯誤",
        text: "請重新上傳",
      });
    }
  };

  const handleChange2 = async ({ fileList }: { fileList: UploadFile[] }) => {
    try {
      setFileList2(fileList.slice(-1)); // 只保留最後一個
      const file: InstagramData = await HandleJsonFile(
        FileList2[0].originFileObj as File
      );
      setFile2(file);
      Toast.fire({
        icon: "success",
        title: "上傳成功",
      });
    } catch (error) {
      console.log(error);

      Toast.fire({
        icon: "error",
        title: "解析檔案錯誤",
        text: "請檢查檔案格式是否正確",
      });
    }
  };

  const UploadFiles = async () => {
    if ([...FileList1, ...FileList2].length === 0) {
      console.log("請先選擇檔案");
      Toast.fire({
        icon: "error",
        title: "請先選擇檔案",
      });
      return;
    }

    try {
      setData([]);
      setData(NoFollowBackUsers(File1 as Followers, File2 as Following));
      setFileList1([]);
      setFileList2([]);
    } catch (error) {
      console.log(error);

      Toast.fire({
        icon: "error",
        title: "搜尋失敗！請確認檔案是否正確",
      });
    }
  };

  return (
    <div className="FileUpload-Container">
      <Space
        direction="vertical"
        align="start"
        wrap={false}
        className="FileUpload-Div"
        size={"small"}
      >
        <div className="Title BottomLine">上傳您的 JSON 檔案</div>
        <div className="Label">Followers 檔案</div>
        <div className="FileUpload-File-Div">
          <Upload
            showUploadList={false}
            multiple={false} // 只能選擇一個檔案
            fileList={FileList1}
            onChange={handleChange1}
            beforeUpload={() => false}
          >
            <Button
              className="FileUpload-File-Button Content"
              icon={<UploadOutlined />}
            >
              選擇檔案
            </Button>
          </Upload>
          {FileList1[0]?.name ?? "尚未上傳任何檔案"}
        </div>
        <div className="Label">Following 檔案</div>
        <div className="FileUpload-File-Div">
          <Upload
            showUploadList={false}
            multiple={false} // 只能選擇一個檔案
            fileList={FileList2}
            onChange={handleChange2}
            beforeUpload={() => false}
          >
            <Button
              className="FileUpload-File-Button Content"
              icon={<UploadOutlined />}
            >
              選擇檔案
            </Button>
          </Upload>
          {FileList2[0]?.name ?? "尚未上傳任何檔案"}
        </div>
        <Button type="primary" onClick={UploadFiles}>
          開始搜尋
        </Button>
      </Space>
      {Data.length !== 0 && (
        <>
          <Space
            direction="vertical"
            align="start"
            wrap={false}
            className="FileUpload-Div"
          >
            <div className="Label BottomLine">尚未回追您的用戶名單</div>
            <table className="FileUpload-Table">
              <tbody>
                {Data.map((user: UserData, index: number) => {
                  return (
                    <tr key={index} className="FileUpload-Table-Row Content">
                      <td>{index + 1}. </td>
                      <td className="FileUpload-Table-Data">
                        <OutsideLink href={user.string_list_data[0].href}>
                          {user.string_list_data[0].value}
                        </OutsideLink>
                      </td>
                      <td className="FileUpload-Table-Data Hint">
                        {user.string_list_data[0].timestamp
                          ? `您於 ${DateFromTimeStamp(
                              user.string_list_data[0].timestamp
                            )} 追蹤了此用戶`
                          : ""}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <Button
              type="default"
              onClick={() => {
                setData([]);
              }}
            >
              關閉
            </Button>
          </Space>
        </>
      )}
    </div>
  );
};
