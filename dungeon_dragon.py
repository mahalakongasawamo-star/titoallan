"""
Blender Script: Low-Poly Dungeon — Dragon Guarding Gold
Run in Blender's Scripting workspace (Alt+P) or:
    blender --background --python dungeon_dragon.py
Tested against Blender 3.6 and 4.x.
"""

import bpy
import math

# ── Utilities ─────────────────────────────────────────────────────────────────

def clear_scene():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    for col in (bpy.data.meshes, bpy.data.materials,
                bpy.data.lights, bpy.data.cameras):
        for item in list(col):
            col.remove(item)


def _make_active(obj):
    bpy.ops.object.select_all(action='DESELECT')
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj


def mat(name, color, rough=0.80, metal=0.0, emit=None, emit_str=4.0):
    """Create a Principled BSDF material (Blender 3.6 / 4.x compatible)."""
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nodes = m.node_tree.nodes
    links = m.node_tree.links
    nodes.clear()
    bsdf = nodes.new("ShaderNodeBsdfPrincipled")
    out  = nodes.new("ShaderNodeOutputMaterial")
    links.new(bsdf.outputs[0], out.inputs[0])
    bsdf.inputs["Base Color"].default_value = (*color[:3], 1.0)
    bsdf.inputs["Roughness"].default_value  = rough
    bsdf.inputs["Metallic"].default_value   = metal
    if emit:
        for key in ("Emission Color", "Emission"):   # 4.x / 3.x fallback
            if key in bsdf.inputs:
                bsdf.inputs[key].default_value = (*emit[:3], 1.0)
                break
        if "Emission Strength" in bsdf.inputs:
            bsdf.inputs["Emission Strength"].default_value = emit_str
    return m


def _apply(obj, material):
    obj.data.materials.clear()
    obj.data.materials.append(material)


def box(name, loc, sc, rot=(0, 0, 0), material=None):
    bpy.ops.mesh.primitive_cube_add(
        size=1, location=loc,
        rotation=tuple(math.radians(r) for r in rot))
    o = bpy.context.active_object
    o.name = name
    o.scale = sc
    bpy.ops.object.transform_apply(scale=True)
    if material:
        _apply(o, material)
    bpy.ops.object.shade_flat()
    return o


def cyl(name, loc, sc, rot=(0, 0, 0), verts=6, material=None):
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=verts, radius=0.5, depth=1,
        location=loc,
        rotation=tuple(math.radians(r) for r in rot))
    o = bpy.context.active_object
    o.name = name
    o.scale = sc
    bpy.ops.object.transform_apply(scale=True)
    if material:
        _apply(o, material)
    bpy.ops.object.shade_flat()
    return o


def cone(name, loc, sc, rot=(0, 0, 0), verts=5, material=None):
    bpy.ops.mesh.primitive_cone_add(
        vertices=verts, radius1=0.5, depth=1,
        location=loc,
        rotation=tuple(math.radians(r) for r in rot))
    o = bpy.context.active_object
    o.name = name
    o.scale = sc
    bpy.ops.object.transform_apply(scale=True)
    if material:
        _apply(o, material)
    bpy.ops.object.shade_flat()
    return o


def ico(name, loc, sc, subdivs=1, material=None):
    bpy.ops.mesh.primitive_ico_sphere_add(
        subdivisions=subdivs, radius=0.5, location=loc)
    o = bpy.context.active_object
    o.name = name
    o.scale = sc
    bpy.ops.object.transform_apply(scale=True)
    if material:
        _apply(o, material)
    bpy.ops.object.shade_flat()
    return o


def wing(name, loc, flip=False, material=None):
    """Hand-built low-poly bat wing mesh."""
    s = -1.0 if flip else 1.0
    verts = [
        (0.00,  0.00,  0.00),   # 0  shoulder top
        (s*0.70, 0.05,  0.40),  # 1  inner-top spar
        (s*1.70, 0.00,  0.10),  # 2  wingtip
        (s*1.30, 0.00, -0.55),  # 3  outer-bottom
        (s*0.60, 0.00, -0.75),  # 4  inner-bottom spar
        (0.00,  0.00, -0.40),   # 5  shoulder bottom
    ]
    faces = [(0, 1, 2), (0, 2, 3), (0, 3, 4), (0, 4, 5)]
    mesh = bpy.data.meshes.new(name + "Mesh")
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    obj.location = loc
    _make_active(obj)
    if material:
        _apply(obj, material)
    bpy.ops.object.shade_flat()
    return obj


# ── Scene init ────────────────────────────────────────────────────────────────

clear_scene()

bpy.context.scene.render.engine       = 'CYCLES'
bpy.context.scene.cycles.samples      = 96
bpy.context.scene.cycles.use_denoising = True


# ── Materials ─────────────────────────────────────────────────────────────────

M_STONE   = mat("Stone",       (0.32, 0.30, 0.27), rough=0.92)
M_MORTAR  = mat("Mortar",      (0.52, 0.50, 0.47), rough=0.96)
M_CEILING = mat("Ceiling",     (0.18, 0.17, 0.16), rough=0.96)
M_DRAGON  = mat("DragonScale", (0.07, 0.28, 0.09), rough=0.68)
M_BELLY   = mat("DragonBelly", (0.20, 0.42, 0.16), rough=0.72)
M_WING    = mat("DragonWing",  (0.04, 0.18, 0.07), rough=0.78)
M_HORN    = mat("Horn",        (0.82, 0.72, 0.42), rough=0.60)
M_EYE     = mat("DragonEye",   (0.95, 0.65, 0.05), rough=0.05,
                emit=(1.0, 0.7, 0.0), emit_str=5.0)
M_GOLD    = mat("Gold",        (0.95, 0.76, 0.08), rough=0.12, metal=1.0)
M_CHEST   = mat("ChestWood",   (0.32, 0.16, 0.05), rough=0.88)
M_TORCH   = mat("TorchWood",   (0.28, 0.16, 0.07), rough=0.90)
M_FIRE    = mat("TorchFire",   (1.00, 0.42, 0.04), rough=0.90,
                emit=(1.0, 0.38, 0.02), emit_str=9.0)
M_BONE    = mat("Bone",        (0.85, 0.80, 0.64), rough=0.78)


# ── Dungeon room ──────────────────────────────────────────────────────────────

W, D, H = 7.0, 9.0, 3.6    # room inner width / depth / height

# Floor
box("Floor",   (0,  0,       -0.10), (W,  D,  0.20), material=M_STONE)
# Ceiling
box("Ceiling", (0,  0,        H),    (W,  D,  0.20), material=M_CEILING)
# Back wall
box("WallBack",  (0,  D/2,   H/2),   (W,  0.35, H),  material=M_STONE)
# Side walls
box("WallLeft",  (-W/2, 0,   H/2),   (0.35, D, H),   material=M_STONE)
box("WallRight", ( W/2, 0,   H/2),   (0.35, D, H),   material=M_STONE)
# Front — two piers flanking open archway
box("FrontPierL", (-W/2+0.75, -D/2, H/2), (1.5, 0.35, H),   material=M_STONE)
box("FrontPierR", ( W/2-0.75, -D/2, H/2), (1.5, 0.35, H),   material=M_STONE)
box("Arch",        (0,        -D/2, H-0.6), (W-3.0, 0.35, 1.2), material=M_STONE)

# Horizontal mortar bands on side walls
for zb in (0.75, 1.55, 2.35):
    box(f"BandL_{zb}", (-W/2+0.18, 0, zb), (0.05, D-0.4, 0.06), material=M_MORTAR)
    box(f"BandR_{zb}", ( W/2-0.18, 0, zb), (0.05, D-0.4, 0.06), material=M_MORTAR)
    box(f"BandBk_{zb}", (0, D/2-0.18, zb), (W-0.4, 0.05, 0.06), material=M_MORTAR)

# Four corner pillars
for ii, px in enumerate((-2.0, 2.0)):
    for jj, py in enumerate((-1.5, 2.0)):
        idx = ii * 2 + jj
        cyl(f"Pillar_{idx}",     (px, py, H/2),      (0.28, 0.28, H),    verts=8, material=M_STONE)
        box(f"PillarBase_{idx}", (px, py, 0.06),      (0.42, 0.42, 0.12), material=M_MORTAR)
        box(f"PillarCap_{idx}",  (px, py, H-0.06),    (0.42, 0.42, 0.12), material=M_MORTAR)


# ── Torches ───────────────────────────────────────────────────────────────────

for ti, (tx, ty, tz) in enumerate([
    (-W/2+0.45,  2.0, 1.8),
    ( W/2-0.45,  2.0, 1.8),
    (-W/2+0.45, -0.8, 1.8),
    ( W/2-0.45, -0.8, 1.8),
]):
    # Bracket stub on wall
    box(f"Bracket_{ti}", (tx, ty, tz - 0.05), (0.06, 0.22, 0.06), material=M_STONE)
    # Torch stick (vertical)
    cyl(f"TorchStick_{ti}", (tx, ty - 0.02, tz + 0.1), (0.04, 0.04, 0.28),
        verts=6, material=M_TORCH)
    # Flame tip
    cone(f"Flame_{ti}", (tx, ty - 0.02, tz + 0.30), (0.07, 0.07, 0.18),
         verts=5, material=M_FIRE)
    # Point light
    bpy.ops.object.light_add(type='POINT', location=(tx, ty - 0.02, tz + 0.38))
    tl = bpy.context.active_object
    tl.name = f"TorchLight_{ti}"
    tl.data.energy          = 90
    tl.data.color           = (1.0, 0.55, 0.18)
    tl.data.shadow_soft_size = 0.12


# ── Treasure pile ─────────────────────────────────────────────────────────────

# Treasure chest (left of gold, slightly open lid)
box("ChestBody", (-0.85, 0.10, 0.22), (0.50, 0.36, 0.34), material=M_CHEST)
box("ChestLid",  (-0.85, 0.10, 0.43), (0.50, 0.36, 0.14), rot=(18, 0, 0),
    material=M_CHEST)
box("ChestBandF",(-0.85, -0.09, 0.24),(0.50, 0.02, 0.30), material=M_GOLD)
box("ChestLock", (-0.85, -0.10, 0.34),(0.06, 0.02, 0.07), material=M_GOLD)

# Main gold mound (icospheres)
for gi, (gl, gs) in enumerate([
    ((0.10,  0.20, 0.09), (0.28, 0.28, 0.12)),
    ((0.25, -0.05, 0.07), (0.22, 0.22, 0.10)),
    ((-0.05, 0.40, 0.07), (0.20, 0.20, 0.09)),
    ((0.10,  0.10, 0.17), (0.24, 0.24, 0.14)),
    ((-0.20, 0.05, 0.06), (0.18, 0.18, 0.08)),
]):
    ico(f"GoldMound_{gi}", gl, gs, subdivs=1, material=M_GOLD)

# Scattered coins
for ci, (cl, cs) in enumerate([
    ((-0.40, 0.25, 0.03), (0.10, 0.10, 0.03)),
    (( 0.38, 0.35, 0.03), (0.11, 0.11, 0.03)),
    (( 0.15,-0.20, 0.03), (0.09, 0.09, 0.03)),
    ((-0.25,-0.10, 0.03), (0.12, 0.12, 0.03)),
    (( 0.45, 0.10, 0.03), (0.10, 0.10, 0.03)),
    ((-0.10, 0.55, 0.03), (0.08, 0.08, 0.03)),
]):
    ico(f"Coin_{ci}", cl, cs, subdivs=1, material=M_GOLD)

# Gold ingots
for ini, (il, irot) in enumerate([
    ((-0.55, 0.40, 0.05), (0, 0,  0)),
    (( 0.40,-0.20, 0.05), (0, 0, 35)),
    ((-0.10, 0.60, 0.05), (0, 0,-20)),
]):
    box(f"Ingot_{ini}", il, (0.18, 0.08, 0.06), rot=irot, material=M_GOLD)


# ── Dragon ────────────────────────────────────────────────────────────────────
# Crouching, head lowered toward gold, wings partially spread.
# Dragon base: (DX=0, DY=1.6)

DX, DY = 0.0, 1.6

# — Body
box("DragonBody",  (DX, DY,        0.52), (0.78, 1.35, 0.52), material=M_DRAGON)
box("DragonBelly", (DX, DY - 0.25, 0.35), (0.58, 0.82, 0.26), material=M_BELLY)
box("DragonChest", (DX, DY - 0.60, 0.54), (0.62, 0.28, 0.46), material=M_DRAGON)

# — Neck (connects chest-front y≈0.93 to head y≈-0.05, bridging ~1m in Y)
box("DragonNeck",  (DX, DY - 1.10, 0.80), (0.24, 1.06, 0.24),
    rot=(6, 0, 0), material=M_DRAGON)

# — Head
box("DragonHead",   (DX,        DY - 1.72, 0.82), (0.44, 0.54, 0.32), material=M_DRAGON)
box("DragonSnout",  (DX,        DY - 2.06, 0.73), (0.30, 0.34, 0.21), material=M_DRAGON)
box("DragonJaw",    (DX,        DY - 2.00, 0.60), (0.27, 0.32, 0.10),
    rot=(-10, 0, 0), material=M_DRAGON)
# Brow ridges
box("BrowL", (DX - 0.16, DY - 1.62, 1.00), (0.13, 0.26, 0.07),
    rot=(4, 0, -6), material=M_DRAGON)
box("BrowR", (DX + 0.16, DY - 1.62, 1.00), (0.13, 0.26, 0.07),
    rot=(4, 0,  6), material=M_DRAGON)
# Nostrils
box("NostrilL", (DX - 0.08, DY - 2.22, 0.78), (0.05, 0.04, 0.04), material=M_BELLY)
box("NostrilR", (DX + 0.08, DY - 2.22, 0.78), (0.05, 0.04, 0.04), material=M_BELLY)

# — Eyes
ico("EyeL", (DX - 0.18, DY - 1.74, 0.90), (0.065, 0.065, 0.065),
    subdivs=1, material=M_EYE)
ico("EyeR", (DX + 0.18, DY - 1.74, 0.90), (0.065, 0.065, 0.065),
    subdivs=1, material=M_EYE)

# — Horns (two pairs)
cone("HornL1",  (DX - 0.15, DY - 1.54, 1.06), (0.07, 0.07, 0.38),
     rot=(-8, 0, -18), verts=4, material=M_HORN)
cone("HornR1",  (DX + 0.15, DY - 1.54, 1.06), (0.07, 0.07, 0.38),
     rot=(-8, 0,  18), verts=4, material=M_HORN)
cone("HornL2",  (DX - 0.10, DY - 1.44, 0.99), (0.05, 0.05, 0.24),
     rot=(-5, 0, -24), verts=4, material=M_HORN)
cone("HornR2",  (DX + 0.10, DY - 1.44, 0.99), (0.05, 0.05, 0.24),
     rot=(-5, 0,  24), verts=4, material=M_HORN)

# — Dorsal spines
for si, (sdy, sz) in enumerate([
    (DY - 0.10, 1.02),
    (DY + 0.28, 0.99),
    (DY + 0.62, 0.92),
    (DY + 0.95, 0.84),
]):
    cone(f"Spine_{si}", (DX, sdy, sz), (0.05, 0.05, 0.24),
         verts=4, material=M_HORN)

# — Wings  (partially spread, hinge at upper-body sides)
wing("WingR", (DX + 0.40, DY - 0.05, 0.84), flip=False, material=M_WING)
wing("WingL", (DX - 0.40, DY - 0.05, 0.84), flip=True,  material=M_WING)

# — Legs (upper segment + foot)
for sgn, side in ((-1, "L"), (1, "R")):
    # Front legs
    cyl(f"FLeg{side}",  (DX + sgn*0.32, DY - 0.60, 0.28),
        (0.14, 0.14, 0.52), rot=(12, 0, sgn*8), verts=6, material=M_DRAGON)
    box(f"FFoot{side}", (DX + sgn*0.34, DY - 0.72, 0.06),
        (0.19, 0.24, 0.10), material=M_DRAGON)
    # Claws
    for ci2, cof in enumerate((-0.06, 0.0, 0.06)):
        cone(f"FClaw{side}_{ci2}", (DX + sgn*(0.34 + cof), DY - 0.83, 0.07),
             (0.03, 0.03, 0.10), rot=(80, 0, 0), verts=4, material=M_HORN)

    # Back legs
    cyl(f"BLeg{side}",  (DX + sgn*0.32, DY + 0.72, 0.28),
        (0.16, 0.16, 0.55), rot=(-8, 0, sgn*6), verts=6, material=M_DRAGON)
    box(f"BFoot{side}", (DX + sgn*0.34, DY + 0.88, 0.06),
        (0.19, 0.26, 0.10), material=M_DRAGON)
    for ci2, cof in enumerate((-0.06, 0.0, 0.06)):
        cone(f"BClaw{side}_{ci2}", (DX + sgn*(0.34 + cof), DY + 0.99, 0.07),
             (0.03, 0.03, 0.10), rot=(80, 0, 0), verts=4, material=M_HORN)

# — Tail (four tapering segments, curving up behind body)
for ti2, (tdy, tz, sc, rx) in enumerate([
    (DY + 0.98, 0.56, (0.28, 0.28, 0.52),  4),
    (DY + 1.42, 0.68, (0.21, 0.21, 0.52),  9),
    (DY + 1.82, 0.84, (0.15, 0.15, 0.46), 18),
    (DY + 2.14, 1.04, (0.09, 0.09, 0.38), 28),
]):
    cyl(f"Tail_{ti2}", (DX, tdy, tz), sc, rot=(rx, 0, 0), verts=6, material=M_DRAGON)
cone("TailTip", (DX, DY + 2.32, 1.24), (0.09, 0.09, 0.28),
     rot=(35, 0, 0), verts=4, material=M_HORN)


# ── Atmospheric props ─────────────────────────────────────────────────────────

# Bones scattered on floor
for bni, (bl, bsc, brot) in enumerate([
    ((-2.50,  1.00, 0.04), (0.05, 0.40, 0.05), (0,  0,  32)),
    ((-2.80, -0.50, 0.04), (0.05, 0.35, 0.05), (0,  0,  78)),
    (( 2.60,  0.60, 0.04), (0.05, 0.38, 0.05), (0,  0, -22)),
    ((-1.80,  2.80, 0.04), (0.05, 0.32, 0.05), (0,  0,  55)),
]):
    cyl(f"Bone_{bni}", bl, bsc, rot=brot, verts=6, material=M_BONE)
ico("Skull", (-2.60, 0.75, 0.13), (0.16, 0.15, 0.13), subdivs=1, material=M_BONE)

# Rubble chunks
for ri, (rl, rsc) in enumerate([
    (( 2.80, -1.60, 0.06), (0.20, 0.16, 0.09)),
    ((-2.70, -1.30, 0.06), (0.16, 0.13, 0.08)),
    (( 2.50,  2.20, 0.06), (0.22, 0.17, 0.10)),
]):
    ico(f"Rubble_{ri}", rl, rsc, subdivs=1, material=M_STONE)

# Wall chains (decorative)
for chi, (cl, cs) in enumerate([
    ((-W/2 + 0.45, 1.8, 1.5), (0.04, 0.04, 0.5)),
    (( W/2 - 0.45, 1.8, 1.5), (0.04, 0.04, 0.5)),
]):
    cyl(f"Chain_{chi}", cl, cs, verts=6, material=M_BONE)
    box(f"Shackle_{chi}", (cl[0], cl[1], cl[2] - 0.3), (0.10, 0.08, 0.06),
        material=M_BONE)


# ── Lighting ──────────────────────────────────────────────────────────────────

# Dim cool ambient (moonlight through arch)
bpy.ops.object.light_add(type='SUN', location=(0, -4, 5))
amb = bpy.context.active_object
amb.name            = "AmbientSun"
amb.data.energy     = 0.06
amb.data.color      = (0.45, 0.55, 0.90)
amb.rotation_euler  = (math.radians(60), 0, math.radians(15))

# Warm overhead key (pooling on dragon + gold)
bpy.ops.object.light_add(type='AREA', location=(0, 1.2, 3.3))
key = bpy.context.active_object
key.name            = "KeyArea"
key.data.energy     = 180
key.data.size       = 2.0
key.data.color      = (1.0, 0.72, 0.38)
key.rotation_euler  = (math.radians(8), 0, 0)

# Gold bounce (from beneath, warm — treasure glows up)
bpy.ops.object.light_add(type='AREA', location=(0, 0.2, 0.28))
gold_light = bpy.context.active_object
gold_light.name           = "GoldBounce"
gold_light.data.energy    = 70
gold_light.data.size      = 0.9
gold_light.data.color     = (1.0, 0.82, 0.22)
gold_light.rotation_euler = (math.radians(180), 0, 0)   # faces down

# Cool rim (back-left, gives dragon silhouette edge)
bpy.ops.object.light_add(type='SPOT', location=(-1.8, 3.8, 2.6))
rim = bpy.context.active_object
rim.name                = "RimSpot"
rim.data.energy         = 220
rim.data.spot_size      = math.radians(50)
rim.data.spot_blend     = 0.22
rim.data.color          = (0.55, 0.65, 1.00)
rim.rotation_euler      = (math.radians(-38), math.radians(-22), math.radians(-28))

# Dark dungeon world background
world = bpy.context.scene.world
world.use_nodes = True
bg = world.node_tree.nodes.get("Background")
if bg:
    bg.inputs["Color"].default_value    = (0.015, 0.015, 0.025, 1.0)
    bg.inputs["Strength"].default_value = 0.0


# ── Camera ────────────────────────────────────────────────────────────────────

bpy.ops.object.camera_add(location=(0.0, -5.8, 1.9))
cam = bpy.context.active_object
cam.name       = "Camera"
cam.data.lens  = 35   # wide-ish for cinematic feel

# Track-to constraint — camera looks at the dragon/gold focal point
bpy.ops.object.empty_add(type='PLAIN_AXES', location=(0.0, 0.8, 0.75))
target = bpy.context.active_object
target.name = "CameraTarget"

ct               = cam.constraints.new(type='TRACK_TO')
ct.target        = target
ct.track_axis    = 'TRACK_NEGATIVE_Z'
ct.up_axis       = 'UP_Y'

bpy.context.scene.camera = cam


# ── Render settings ───────────────────────────────────────────────────────────

scene = bpy.context.scene
scene.render.resolution_x              = 1920
scene.render.resolution_y              = 1080
scene.render.image_settings.file_format = 'PNG'
scene.render.filepath                  = "//dungeon_dragon_render.png"

print("Low-poly dungeon scene ready.  Press F12 to render.")
