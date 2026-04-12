"""
Blender Script: Metallic Red Sphere on a Wooden Table
Run via: blender --python metallic_sphere_on_table.py
Or paste into Blender's Scripting editor and press Run Script.
"""

import bpy
import math


# ── Helpers ──────────────────────────────────────────────────────────────────

def clear_scene():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    for col in list(bpy.data.collections):
        bpy.data.collections.remove(col)


def new_material(name):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    mat.node_tree.nodes.clear()
    return mat


def add_principled(mat, **kwargs):
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    bsdf = nodes.new("ShaderNodeBsdfPrincipled")
    out  = nodes.new("ShaderNodeOutputMaterial")
    links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])
    for key, val in kwargs.items():
        if key in bsdf.inputs:
            bsdf.inputs[key].default_value = val
    return bsdf


# ── Scene setup ──────────────────────────────────────────────────────────────

clear_scene()

# Use Cycles for realistic metallic + wood shading
bpy.context.scene.render.engine = 'CYCLES'
bpy.context.scene.cycles.samples = 128
bpy.context.scene.cycles.use_denoising = True


# ── Table ─────────────────────────────────────────────────────────────────────
# Dimensions (metres): top 1.2 × 0.7 × 0.05, legs 0.05 × 0.05 × 0.72

TABLE_TOP_W  = 1.2
TABLE_TOP_D  = 0.7
TABLE_TOP_H  = 0.05
LEG_W        = 0.05
LEG_H        = 0.72
TABLE_TOP_Z  = LEG_H + TABLE_TOP_H / 2   # centre of the top slab

# Table-top
bpy.ops.mesh.primitive_cube_add(size=1)
top = bpy.context.active_object
top.name = "TableTop"
top.scale = (TABLE_TOP_W / 2, TABLE_TOP_D / 2, TABLE_TOP_H / 2)
top.location = (0, 0, TABLE_TOP_Z)
bpy.ops.object.transform_apply(scale=True)

# Four legs (offset from top corners)
leg_offsets = [
    ( TABLE_TOP_W/2 - LEG_W/2 - 0.02,  TABLE_TOP_D/2 - LEG_W/2 - 0.02),
    (-TABLE_TOP_W/2 + LEG_W/2 + 0.02,  TABLE_TOP_D/2 - LEG_W/2 - 0.02),
    ( TABLE_TOP_W/2 - LEG_W/2 - 0.02, -TABLE_TOP_D/2 + LEG_W/2 + 0.02),
    (-TABLE_TOP_W/2 + LEG_W/2 + 0.02, -TABLE_TOP_D/2 + LEG_W/2 + 0.02),
]
for i, (lx, ly) in enumerate(leg_offsets):
    bpy.ops.mesh.primitive_cube_add(size=1)
    leg = bpy.context.active_object
    leg.name = f"TableLeg_{i+1}"
    leg.scale = (LEG_W / 2, LEG_W / 2, LEG_H / 2)
    leg.location = (lx, ly, LEG_H / 2)
    bpy.ops.object.transform_apply(scale=True)

# ── Wood material ─────────────────────────────────────────────────────────────

wood_mat = new_material("Wood")
nodes = wood_mat.node_tree.nodes
links = wood_mat.node_tree.links

bsdf   = nodes.new("ShaderNodeBsdfPrincipled")
output = nodes.new("ShaderNodeOutputMaterial")
links.new(bsdf.outputs["BSDF"], output.inputs["Surface"])

# Procedural wood grain with a Wave + Noise texture
tex_coord = nodes.new("ShaderNodeTexCoord")
mapping   = nodes.new("ShaderNodeMapping")
mapping.inputs["Scale"].default_value = (3, 3, 3)
links.new(tex_coord.outputs["Object"], mapping.inputs["Vector"])

noise = nodes.new("ShaderNodeTexNoise")
noise.inputs["Scale"].default_value    = 12.0
noise.inputs["Detail"].default_value   = 8.0
noise.inputs["Roughness"].default_value = 0.65
noise.inputs["Distortion"].default_value = 0.4
links.new(mapping.outputs["Vector"], noise.inputs["Vector"])

wave = nodes.new("ShaderNodeTexWave")
wave.wave_type = 'RINGS'
wave.inputs["Scale"].default_value     = 4.0
wave.inputs["Distortion"].default_value = 3.0
wave.inputs["Detail"].default_value    = 4.0
wave.inputs["Detail Scale"].default_value = 1.5

# Mix noise into wave vector for organic look
mix_vec = nodes.new("ShaderNodeVectorMath")
mix_vec.operation = 'ADD'
links.new(mapping.outputs["Vector"], mix_vec.inputs[0])
links.new(noise.outputs["Color"],    mix_vec.inputs[1])
links.new(mix_vec.outputs["Vector"], wave.inputs["Vector"])

# Color ramp: dark walnut tones
ramp = nodes.new("ShaderNodeValToRGB")
ramp.color_ramp.elements[0].position = 0.0
ramp.color_ramp.elements[0].color    = (0.22, 0.10, 0.04, 1)   # dark brown
ramp.color_ramp.elements[1].position = 1.0
ramp.color_ramp.elements[1].color    = (0.55, 0.28, 0.10, 1)   # warm oak
links.new(wave.outputs["Color"], ramp.inputs["Fac"])

links.new(ramp.outputs["Color"], bsdf.inputs["Base Color"])
bsdf.inputs["Roughness"].default_value = 0.35
bsdf.inputs["Specular IOR Level"].default_value = 0.3

# Assign wood material to top + all legs
for obj_name in ["TableTop"] + [f"TableLeg_{i+1}" for i in range(4)]:
    obj = bpy.data.objects[obj_name]
    obj.data.materials.clear()
    obj.data.materials.append(wood_mat)


# ── Metallic Red Sphere ───────────────────────────────────────────────────────

SPHERE_RADIUS = 0.12
sphere_z = TABLE_TOP_Z + TABLE_TOP_H / 2 + SPHERE_RADIUS   # resting on top

bpy.ops.mesh.primitive_uv_sphere_add(
    radius=SPHERE_RADIUS,
    segments=64,
    ring_count=32,
    location=(0, 0, sphere_z)
)
sphere = bpy.context.active_object
sphere.name = "MetallicRedSphere"

# Smooth shading
bpy.ops.object.shade_smooth()

# Metallic red Principled BSDF
metal_mat = new_material("MetallicRed")
bsdf = add_principled(
    metal_mat,
    **{
        "Base Color":  (0.72, 0.04, 0.04, 1.0),   # vivid red
        "Metallic":    1.0,
        "Roughness":   0.10,                        # near-mirror finish
        "Specular IOR Level": 1.0,
    }
)
sphere.data.materials.append(metal_mat)


# ── Floor plane ───────────────────────────────────────────────────────────────

bpy.ops.mesh.primitive_plane_add(size=6, location=(0, 0, 0))
floor = bpy.context.active_object
floor.name = "Floor"

floor_mat = new_material("FloorConcrete")
add_principled(
    floor_mat,
    **{
        "Base Color": (0.55, 0.55, 0.55, 1.0),
        "Roughness":  0.85,
    }
)
floor.data.materials.append(floor_mat)


# ── Lighting ──────────────────────────────────────────────────────────────────

# Key light (area, warm)
bpy.ops.object.light_add(type='AREA', location=(2.5, -2.0, 3.5))
key = bpy.context.active_object
key.name = "KeyLight"
key.data.energy = 600
key.data.size   = 1.5
key.data.color  = (1.0, 0.95, 0.85)
key.rotation_euler = (math.radians(55), 0, math.radians(35))

# Fill light (area, cool, lower energy)
bpy.ops.object.light_add(type='AREA', location=(-2.0, 1.5, 2.5))
fill = bpy.context.active_object
fill.name = "FillLight"
fill.data.energy = 200
fill.data.size   = 2.0
fill.data.color  = (0.8, 0.88, 1.0)
fill.rotation_euler = (math.radians(45), 0, math.radians(-40))

# Rim light (spot, behind)
bpy.ops.object.light_add(type='SPOT', location=(0.5, 2.8, 2.5))
rim = bpy.context.active_object
rim.name = "RimLight"
rim.data.energy          = 350
rim.data.spot_size       = math.radians(45)
rim.data.spot_blend      = 0.15
rim.rotation_euler = (math.radians(-40), 0, math.radians(10))

# World HDRI-style gradient background
world = bpy.context.scene.world
world.use_nodes = True
bg_node = world.node_tree.nodes.get("Background")
if bg_node:
    bg_node.inputs["Color"].default_value   = (0.05, 0.05, 0.08, 1.0)
    bg_node.inputs["Strength"].default_value = 0.4


# ── Camera ────────────────────────────────────────────────────────────────────

bpy.ops.object.camera_add(location=(1.8, -2.2, 1.6))
cam = bpy.context.active_object
cam.name = "Camera"
cam.rotation_euler = (math.radians(68), 0, math.radians(40))
cam.data.lens = 50   # 50 mm for natural perspective

bpy.context.scene.camera = cam


# ── Render output settings ────────────────────────────────────────────────────

scene = bpy.context.scene
scene.render.resolution_x       = 1920
scene.render.resolution_y       = 1080
scene.render.image_settings.file_format = 'PNG'
scene.render.filepath           = "//render_metallic_sphere_table.png"

print("Scene ready. Press F12 (or bpy.ops.render.render(write_still=True)) to render.")
