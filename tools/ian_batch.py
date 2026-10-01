import json
IMG="9f617e54-ef80-41f1-8f73-fcd8ceaa4133"
VOICE=("VOICE: one consistent young Korean man in his mid-20s, native Seoul Korean pronunciation, crystal-clear diction. "
"Deep, low, velvety baritone, slightly husky, relaxed and unhurried, cool and confident with a lazy teasing edge, charismatic like a K-pop idol talking quietly to one person. "
"Not warm-cheerful, not shouting, not theatrical, no accent. Quiet salon room tone only, no background music.")
BASE=("The man in the image speaks directly to the camera in Korean, lips moving in precise sync with every syllable. "
"He stays seated in the same pose and framing the whole time; only subtle natural head tilt, blinks and small eyebrow movement. "
"Camera locked off, no zoom, no cuts. He starts and ends in exactly the same neutral pose as the image, mouth closed. "
"Candle flames flicker softly behind him. ")
L=[("t1",5,"왔네. 기다리고 있었어. 이리 와서 앉아."),
("t1a",6,"네 운명 알아보는 데야. 내 말 잘 들으면… 바꿀 수도 있고."),
("t1b",4,"말 잘 듣네. 마음에 들어."),
("t2",5,"태어난 날이랑 시간 알려줘. 시간은 몰라도 돼."),
("t3",5,"…역시. 너, 한쪽 기운이 텅 비어 있어."),
("t4",4,"요즘 제일 걸리는 거, 솔직하게 말해봐."),
("t5",6,"비어 있는 그 기운, 채워줄 녀석이 있어. 불러볼게."),
("t6",7,"이제 걔가 네 편이야. 내일 아침부터 미션 보낼 거니까, 알림 켜 둬.")]
reqs=[]
for i,(k,d,line) in enumerate(L):
    reqs.append({"index":i,"params":{"model":"kling3_0","mode":"pro","sound":"on","duration":d,"aspect_ratio":"9:16",
      "declined_preset_id":"24bae836-2c4a-48e0-89b6-49fcc0b21612",
      "medias":[{"value":IMG,"role":"start_image"},{"value":IMG,"role":"end_image"}],
      "prompt":BASE+f'He says in Korean, exactly: "{line}" '+VOICE}})
reqs.append({"index":8,"params":{"model":"kling3_0","mode":"pro","sound":"off","duration":5,"aspect_ratio":"9:16",
  "declined_preset_id":"24bae836-2c4a-48e0-89b6-49fcc0b21612",
  "medias":[{"value":IMG,"role":"start_image"},{"value":IMG,"role":"end_image"}],
  "prompt":"The man in the image sits still and silently, mouth closed, not speaking. Only subtle idle life: slow breathing, a slow blink, a tiny head tilt, a faint knowing smirk, gaze held on the camera. Same pose and framing throughout; camera locked off, no zoom, no cuts. Starts and ends in exactly the same pose as the image. Candle flames flicker softly behind him."}})
print(json.dumps(reqs,ensure_ascii=False))
