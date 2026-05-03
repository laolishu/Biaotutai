# Biaotutai

Design annotation and parsing platform for frontend and data-wall developers.

Biaotutai converts PSD/images into structured annotation data, helping teams implement pixel-accurate UI reconstruction and AI-assisted code generation.

中文版本: [README.zh-CN.md](README.zh-CN.md)

## Overview

Biaotutai focuses on a practical flow:

Upload design file -> Parse layer structure -> Inspect annotations -> Export JSON

The project is built around a dynamic coordinate system, so it can support 1920x1080, 3840x1080, and other arbitrary PSD sizes without hardcoded resolutions.

## Core Features

- Pixel-level annotation data instead of manual measurement
- Automatic PSD layer parsing using ag-psd
- Geometry and style inspection for frontend implementation
- Structured JSON export as input for AI code workflows
- Read-only viewer mode for sharing annotations

## Product Structure

- Upload: upload PSD/image and enter annotation workflow
- Workbench: layer tree + canvas + properties panel
- Viewer: read-only sharing page for annotation inspection

## Technical Architecture

### Stack

| Module | Technology |
| --- | --- |
| Frontend | Vue 3 + Composition API |
| UI | Element Plus |
| Styling | Tailwind CSS |
| State | Pinia |
| PSD Parsing | ag-psd |
| Rendering | DOM + absolute + transform |
| Optional Backend | Cloudflare Workers |

### Layered Model

- UI Components layer
- Viewport container layer
- World annotation rendering layer

### Coordinate Principles

- Do not use canvas as the primary rendering engine
- Do not hardcode target resolutions
- World size follows PSD width/height
- Annotation coordinates use raw PSD layer values directly

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Install

```bash
npm install
```

### Run in Development

```bash
npm run dev
```

Default local URL: http://localhost:3000

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Repository Structure

```text
biaotutai/
|- docs/
|  |- design.md
|- src/
|  |- views/
|  |  |- Upload.vue
|  |  |- Workbench.vue
|  |  |- Viewer.vue
|  |- router/
|  |- store/
|  |- styles/
|- openspec/
|- package.json
|- README.md
|- README.zh-CN.md
```

## Roadmap

- MVP: upload, annotation viewing, JSON export
- v1.1: zoom and share
- v1.2: AI component recognition
- v2.0: automatic code generation

## Related Docs

- Product design source: [docs/design.md](docs/design.md)
- Workbench style guide: [docs/workbench-style-guide.md](docs/workbench-style-guide.md)

## Contributing

Issues and pull requests are welcome.

If you are proposing product-level behavior changes, please create or update an OpenSpec change under openspec/changes first.

