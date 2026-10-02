# 소아르카나 56장 생성 지시문 (2026-10-03). 참조: c01(facd052b) · c17(cc2a04b5) = 대아르카나 그림체
STYLE=("A single tarot card from exactly the same deck as the two reference images, matching them closely: the identical card frame - "
"dark navy card face, ornate gold filigree inner border, an iridescent mother-of-pearl (Korean najeon) mosaic outer border, rounded corners, "
"an empty dark nameplate band across the top and an empty dark nameplate band across the bottom, both plates left completely blank. "
"Inside the picture window: a 2.5D semi-realistic Korean webtoon illustration with strong depth, perspective and real cinematic light, "
"Korean characters in elegant hanbok or Joseon-inspired dress, Korean landscapes and architecture. The whole card is visible, straight-on, centered, filling the image. "
"ABSOLUTELY NO TEXT: no letters, no numbers, no Roman numerals, no captions, no writing anywhere on the card. Scene: ")
SUIT={'wa':"Suit of Wands: the wands are living wooden staffs sprouting fresh green leaves.",
'cu':"Suit of Cups: the cups are white Korean porcelain (baekja) cups.",
'sw':"Suit of Swords: the swords are polished steel Korean straight swords.",
'pe':"Suit of Pentacles: the pentacles are large golden Korean yeopjeon coins (round coins with a square hole in the center)."}
C={
'wa01':"A hand emerging from a soft glowing cloud holds exactly one leafy wooden staff upright; below, a Korean mountain valley with a tiled-roof pavilion and a winding river.",
'wa02':"A young nobleman in a dark hanbok and gat stands on a fortress wall holding a small brass celestial globe in one hand and one leafy staff in the other, a second leafy staff fixed to the wall beside him (exactly two staffs), gazing over the sea and distant villages.",
'wa03':"A man seen from behind on a high cliff, exactly three leafy staffs planted around him, watching sailing ships cross a golden sea at sunrise.",
'wa04':"Exactly four leafy staffs garlanded with flowers and silk ribbons form a festive gate; two women in bright hanbok raise bouquets in joy; a hanok manor behind.",
'wa05':"Five young men in hanbok sparring playfully, each with one leafy staff (exactly five staffs) crossing chaotically, dust in the air of a courtyard.",
'wa06':"A victorious rider on a white horse wearing a wreath of leaves, holding a staff topped with a wreath, a crowd walking beside him holding five more staffs (exactly six staffs), festive light.",
'wa07':"A determined young man on a hilltop holding one leafy staff in defense against exactly six staffs rising toward him from below the edge, wind in his hanbok.",
'wa08':"Exactly eight leafy staffs flying diagonally in parallel through a clear sky over rolling Korean hills and a river, swift motion.",
'wa09':"A weary bandaged guard in hanbok leaning on one leafy staff, wary and watchful, with exactly eight more staffs standing behind him like a palisade.",
'wa10':"A man bent forward carrying a heavy bundle of exactly ten leafy staffs toward a distant hanok village.",
'wa11':"A young page in green hanbok standing in a golden field, holding one sprouting leafy staff upright and gazing at it in wonder.",
'wa12':"A young knight in light Joseon armor with a red sash charging on a rearing chestnut horse, holding one leafy staff, dust and sunlight.",
'wa13':"A confident queen in a gold-and-red hanbok seated on a throne carved with lions, holding one leafy staff and a sunflower, a black cat at her feet.",
'wa14':"A commanding king in red royal robes seated on a throne carved with lions and salamanders, holding one flowering staff, gazing to the side.",
'cu01':"A hand emerging from a soft glowing cloud holds exactly one white porcelain cup overflowing with five streams of water; a white dove descends above it; a lotus pond below.",
'cu02':"A young man and a young woman in hanbok facing each other, each offering one white porcelain cup (exactly two cups), a small winged lion emblem glowing above them, a hanok behind.",
'cu03':"Three young women in pastel hanbok raising white porcelain cups in a toast (exactly three cups), dancing in a harvest garden full of fruit.",
'cu04':"A young man sitting under a pine tree with crossed arms, exactly three cups on the grass before him, and a hand from a cloud offering a fourth cup that he ignores.",
'cu05':"A figure in a long black cloak with head bowed, exactly three spilled cups before him and exactly two upright cups behind him, a river and a stone bridge leading to a distant hanok.",
'cu06':"A boy offering a white porcelain cup filled with flowers to a little girl in a hanok courtyard, exactly six flower-filled cups around them, warm nostalgic light.",
'cu07':"A silhouetted figure facing exactly seven cups floating in clouds, each cup holding a different vision: a face, a jewel, a small dragon, a wreath, a tiny palace, a snake, and a veiled glowing figure.",
'cu08':"A cloaked traveler with a walking stick walking away under the moon toward misty mountains, leaving exactly eight stacked cups behind on the shore.",
'cu09':"A contented man sitting with arms crossed in front of a long table draped in blue silk, exactly nine cups arranged in an arc behind him.",
'cu10':"A happy couple with arms raised and two children dancing beside them, a rainbow across the sky holding exactly ten cups, a hanok home by a river.",
'cu11':"A young page in blue hanbok by the sea holding one white cup from which a small fish peeks out, amused.",
'cu12':"A graceful knight on a white horse walking slowly by a calm river, holding out one white porcelain cup, wearing a winged helm.",
'cu13':"A gentle queen in a sea-blue hanbok seated on a throne at the shore, gazing into one ornate lidded cup.",
'cu14':"A calm king in blue royal robes on a stone throne floating on a rough sea, holding one cup and a scepter, a ship and a leaping fish behind.",
'sw01':"A hand emerging from a soft glowing cloud holds exactly one gleaming upright straight sword crowned with a golden crown draped with olive and palm leaves; jagged mountains below.",
'sw02':"A blindfolded woman in white hanbok seated by the sea at night, holding exactly two swords crossed over her chest, a crescent moon above.",
'sw03':"A crimson heart pierced by exactly three swords, floating in a grey rainy sky with storm clouds. Symbolic, no blood, no gore.",
'sw04':"A knight effigy resting peacefully on a stone tomb in a quiet temple hall, hands joined in prayer, exactly three swords hanging on the wall and one sword beneath the tomb, soft light through a paper lattice window.",
'sw05':"A smug young man gathering three swords while two dejected figures walk away toward the shore, two more swords on the ground (exactly five swords), windy clouds.",
'sw06':"A ferryman rowing a small boat carrying a cloaked woman and a child across calm water toward a distant shore, exactly six swords standing upright in the boat.",
'sw07':"A sly man tiptoeing away from a military camp carrying five swords in his arms, two swords left planted in the ground (exactly seven swords), glancing back.",
'sw08':"A woman in white hanbok, loosely bound and blindfolded, standing among exactly eight swords planted in muddy ground, a fortress on a cliff behind.",
'sw09':"A woman sitting up in bed at night with her face in her hands, exactly nine swords hanging horizontally on the dark wall behind her, a quilt patterned with roses.",
'sw10':"A figure lying face down on a quiet shore at dusk with exactly ten swords standing in the ground beside and above them, black sky giving way to a golden dawn on the horizon. Symbolic and calm, no blood, no gore.",
'sw11':"A young page in grey-blue hanbok standing on a windy hill holding one sword upright, alert, birds in the sky.",
'sw12':"A knight in steel armor charging at full gallop on a white horse with one sword raised, storm clouds and wind-bent trees.",
'sw13':"A stern elegant queen in silver-white hanbok seated on a stone throne among clouds, holding one upright sword, one hand extended.",
'sw14':"A just king in blue and silver robes on a high stone throne carved with butterflies, holding one upright sword, facing forward.",
'pe01':"A hand emerging from a soft glowing cloud holds exactly one large golden yeopjeon coin; below, a lush garden with a flowered arch opening toward distant mountains.",
'pe02':"A young man in hanbok juggling exactly two large golden coins linked by an infinity-shaped ribbon, ships riding big waves behind him.",
'pe03':"A stonemason carving a temple arch decorated with exactly three golden coins, a monk and a scholar holding plans consulting him.",
'pe04':"A man in rich hanbok seated clutching one golden coin to his chest, one coin balanced on top of his gat hat and one under each foot (exactly four coins), a city behind.",
'pe05':"Two poor figures in ragged clothes walking through falling snow past a warmly lit lattice window that holds exactly five golden coins.",
'pe06':"A wealthy merchant holding a balance scale and giving coins to two kneeling beggars, exactly six golden coins floating around the scene.",
'pe07':"A farmer leaning on his hoe, looking at a green bush growing exactly seven golden coins.",
'pe08':"An artisan at a workbench carefully carving a golden coin, exactly eight coins displayed on a post beside him, focused.",
'pe09':"An elegant woman in luxurious hanbok in a grape vineyard with a hooded falcon on her gloved hand, exactly nine golden coins among the vines.",
'pe10':"An elderly man with two white dogs, a family and a child under a grand hanok gate, exactly ten golden coins arranged in the scene.",
'pe11':"A young page in earthy-green hanbok standing in a flowering field, holding up one golden coin and studying it.",
'pe12':"A steady knight on a heavy black horse standing still in a plowed field, holding one golden coin.",
'pe13':"A nurturing queen in an ochre-and-green hanbok seated in a rose garden, holding one golden coin in her lap, a rabbit nearby.",
'pe14':"A prosperous king in dark robes embroidered with grapes seated on a throne with bull heads, holding one golden coin and a scepter, a castle behind.",
}
import json
out=[]
for i,(k,v) in enumerate(C.items()):
    out.append({'index':i,'key':k,'prompt':STYLE+SUIT[k[:2]]+" "+v})
json.dump(out,open('prompts.json','w'),ensure_ascii=False,indent=0)
print(len(out))
