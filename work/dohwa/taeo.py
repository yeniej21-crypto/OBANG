import json
VOICE="VOICE: one young Korean man in his early 20s, native Seoul Korean, clear soft diction. Warm, soft, gentle mid-low voice at a quiet, intimate volume, as if speaking close to a microphone. Sweet and playful like a charming younger boyfriend teasing an older girl he likes, a smile audible in the voice, slightly breathy and tender. Smooth clean texture: no rasp, no gravel, not greasy, not oily, not theatrical, not loud, not childish, not high-pitched. Quiet room tone only, no background music."
POSE3="9604b2cc-9f3e-46f1-a6fa-f14c8e09042c"; BASE="30e906e9-e6ec-48e4-8a4e-f2377c21d0e2"
C=[
("v2",POSE3,7,"근데 이상하다. 이 정도면 사람들이 가만 안 뒀을 텐데… 누나가 문 닫고 있었지?",
 "chin resting on his hand; on '근데 이상하다' his eyebrows lift slightly and he tilts his head as if puzzled; during the middle sentence his eyes narrow softly with a curious, knowing look; on the final question '누나가 문 닫고 있었지?' a small teasing half-smile appears and he gives a tiny nod, as if he caught her secret","his hand stays under his chin"),
("v3",POSE3,5,"잠깐만 기다려봐. 누나 도화, 제대로 한번 풀어볼게.",
 "on '잠깐만 기다려봐' he slowly lifts his chin off his hand and straightens up a little, playful and confident; on '제대로 한번 풀어볼게' he gives a charming, eager, slightly mischievous smile with a small nod","his hands move only slightly and slowly"),
("v4",BASE,5,"나머지는… 누나만 보라고 따로 써놨어.",
 "a soft, slightly shy but flirtatious look; after '나머지는' a short pause and his eyes glance aside briefly then come back to the camera; on '누나만 보라고' his voice softens and a sweet, secretive smile forms; on '따로 써놨어' a tiny head tilt and his eyes soften warmly","his shoulders move only slightly"),
]
out=[]
for i,(k,img,d,line,act,body) in enumerate(C):
    out.append({"index":i,"params":{"model":"kling3_0","mode":"pro","sound":"on","duration":d,"aspect_ratio":"9:16",
     "declined_preset_id":"24bae836-2c4a-48e0-89b6-49fcc0b21612","medias":[{"value":img,"role":"start_image"}],
     "prompt":("The young man speaks to the camera in Korean; his mouth clearly opens and closes, lips visibly moving in precise sync with every syllable, unhurried. "
      f'He says in Korean, exactly: "{line}" '
      f"Acting, relaxed and alive, his head moving gently and naturally like a real person in an intimate conversation: {act}. "
      f"His face stays at eye level, never bowing down; {body}, upper body moves only slightly. Natural blinking. Never glaring, no exaggerated expressions. "
      "Static camera, no zoom, no cuts. Keep his face, hair, outfit, earring, necklace and the night penthouse background exactly as in the image. "+VOICE)}})
print(json.dumps(out,ensure_ascii=False))
