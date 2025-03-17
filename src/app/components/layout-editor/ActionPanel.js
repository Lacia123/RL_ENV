"use client";
import React, { useState } from "react";
import NewActionPanel from "./newActionPanel";

/**
 * 动作操作面板 - 用于强化学习环境的动作选择
 *
 * 此组件已被重构为基于抽象化的动作配置系统的新版本。
 * 为了保持向后兼容性，我们导出新版本但保持相同的接口。
 */
const ActionPanel = (props) => {
  // 添加loading和消息状态
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // 处理导入序列
  const handleImportSequence = async (event) => {
    console.log("处理导入动作序列...");
    const file = event.target.files[0];
    if (!file) {
      console.log("未选择文件");
      return;
    }

    try {
      setLoading(true);
      console.log("开始导入文件:", file.name);

      // 确保布局清空
      if (props.onClearLayout) {
        console.log("调用清空布局...");
        await props.onClearLayout();
        
        // 给 React 状态更新一点时间
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // 确保已使用元素状态重置
      if (props.onResetUsedElements) {
        console.log("重置已使用元素状态...");
        await props.onResetUsedElements();
        
        // 给 React 状态更新一点时间
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // 执行导入
      console.log("执行导入和序列回放...");
      const actionExecutor = props.actionExecutor;
      if (!actionExecutor) {
        throw new Error("未找到Action执行器");
      }

      // 添加延迟确保状态已完全更新
      await new Promise(resolve => setTimeout(resolve, 200));
      
      console.log("调用 importAndExecuteSequence...");
      const result = await actionExecutor.importAndExecuteSequence(file, 10.0);
      console.log("导入结果:", result);

      if (result.success) {
        console.log("导入成功，序列名称:", result.sequenceName);
        setMessage(
          `成功导入并执行动作序列 "${result.sequenceName}"，共 ${result.actionsCount} 个动作`,
        );

        // 给React状态更新一点时间
        setTimeout(() => {
          console.log("状态更新延迟后检查布局是否已更新");
        }, 500);
      } else {
        console.error("导入失败:", result.error);
        setError(`导入失败: ${result.error || "未知错误"}`);
      }
    } catch (error) {
      console.error("导入发生异常:", error);
      setError(`导入异常: ${error.message}`);
    } finally {
      setLoading(false);

      // 清除file input的值，允许重新导入相同文件
      event.target.value = "";
    }
  };

  // 将扩展的props传递给NewActionPanel
  return (
    <div className="action-panel-wrapper">
      {/* 检查是否导入了NewActionPanel */}
      {typeof NewActionPanel === "function" ? (
        <NewActionPanel
          {...props}
          loading={loading}
          setLoading={setLoading}
          message={message}
          setMessage={setMessage}
          error={error}
          setError={setError}
          onImportSequence={handleImportSequence}
        />
      ) : (
        <div className="p-4 bg-red-100 border border-red-300 rounded-lg">
          <p className="text-red-600">错误：无法加载NewActionPanel组件</p>
          <p className="text-sm text-red-500">
            请检查组件导入路径和文件名是否正确
          </p>
        </div>
      )}

      {/* 显示加载状态和消息 */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <p>正在处理导入操作，请稍候...</p>
          </div>
        </div>
      )}

      {message && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}
    </div>
  );
};

export default ActionPanel;
