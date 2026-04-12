"""
Blender Script: Red Cube
Run via: blender --python red_cube.py
Or paste into Blender's Scripting editor and press Run Script.
"""

import bpy


# Clear default scene
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

# Add cube
bpy.ops.mesh.primitive_cube_add(size=2, location=(0, 0, 0))
cube = bpy.context.active_object
cube.name = "RedCube"

# Create red material
mat = bpy.data.materials.new(name="Red")
mat.use_nodes = True
bsdf = mat.node_tree.nodes.get("Principled BSDF")
bsdf.inputs["Base Color"].default_value = (0.8, 0.02, 0.02, 1.0)
bsdf.inputs["Roughness"].default_value = 0.4

cube.data.materials.append(mat)

print("Red cube created.")
