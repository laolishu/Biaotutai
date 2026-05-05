实现任务列表

1. 在上传页面添加复选框（前端）
   - 文件：定位 `src/views/Upload*.vue` 或相关上传组件，新增 `skipHiddenLayers` 复选框（默认 checked）。
   - 将复选框值随上传事件或表单一起传递。

2. 导入流程接收并传递参数（逻辑）
   - 检查现有导入/normalize 的调用链，确保 `skipHiddenLayers` 参数被传递到 `normalizeNode` / PSD 解析入口或等价位置。
   - 如未存在参数通道，添加参数并在内部过滤 `node.hidden === true` 的图层。

3. 测试
   - 为关键路径添加单元/集成测试。

4. 文档更新
   - 更新 `docs/` 中的导入说明，记录新默认行为与如何覆盖。

5. 构建与验证
   - 运行 `npm run build`，并在本地手动验证上传带隐藏图层的 PSD 的行为是否符合预期。
