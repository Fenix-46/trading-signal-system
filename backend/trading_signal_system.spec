# -*- mode: python ; coding: utf-8 -*-
from pathlib import Path
import sys

block_cipher = None

project_root = Path.cwd().resolve()
backend_dir = project_root / 'backend'
entry_point = str(backend_dir / 'main.py')

a = Analysis(
    [entry_point],
    pathex=[str(project_root), str(backend_dir)],
    binaries=[],
    datas=[],
    hiddenimports=['uvicorn', 'uvicorn.logging', 'uvicorn.protocols', 'uvicorn.lifespan', 'uvicorn.loops', 'uvicorn.loops.auto', 'uvicorn.loops.asyncio', 'fastapi', 'fastapi.routing'],
    hookspath=[],
    hooks=[],
    runtime_hooks=[],
    excludes=[],
    noarchive=False,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name='main',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=True,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)

coll = COLLECT(
    exe,
    a.binaries,
    a.zipfiles,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name='main',
)
