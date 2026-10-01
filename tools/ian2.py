import json,sys
IMG="9f617e54-ef80-41f1-8f73-fcd8ceaa4133"
VOICE=("VOICE: one young Korean man in his mid-20s, native Seoul Korean, clear soft diction. Low, smooth, velvety and slightly breathy voice at a quiet, intimate volume, as if speaking close to a microphone. "
"Languid and unhurried, cool and aloof, a little bored, elegant and effortlessly sexy with a faint teasing undertone. Smooth texture: no rasp, no gravel, no growl, no aggression; not tough, not loud, not theatrical, not cheerful. Keep the voice in a low, deep register the whole time; not light, not thin, not high-pitched, not youthful-bright. Quiet salon room tone only, no background music.")
COMMON=("His face stays at eye level, never bowing down; his upper body moves only slightly and his arms stay resting where they are. "
"Towards the end he eases back close to his starting pose. Natural blinking. Never glaring, never frowning, no exaggerated expressions. "
"Static camera, no zoom, no cuts. Keep his face, hair, outfit and the salon background exactly as in the image. ")
C={
"t1b":(4,"말 잘 듣네. 마음에 들어.","a slow lazy nod on the first words as if approving, then he tilts his head gently to one side and on the last words a pleased, amused, charming half-smile appears and his eyes soften"),
"t2":(5,"태어난 날이랑 시간 알려줘. 시간은 몰라도 돼.","a small casual turn of the head to the side and back while asking, as if it is no big deal; on the second sentence a tiny relaxed shrug of one shoulder and a faint easy smile, head slightly tilted"),
"t3":(5,"…역시. 너, 한쪽 기운이 텅 비어 있어.","he starts with a knowing look, his eyes (eyes only, head level) glance down briefly toward the desk as if reading something, then slowly lift back to the camera on the word '너'; a small slow nod, then his head tilts slightly and a subtle, mysterious, intrigued smile forms at one corner of his lips"),
"t4":(4,"요즘 제일 걸리는 거, 솔직하게 말해봐.","his head is tilted gently to one side, soft curious eyes, a faint coaxing smile; a tiny encouraging nod on the last words, as if inviting you to confess"),
"t5":(6,"비어 있는 그 기운, 채워줄 녀석이 있어. 불러볼게.","calm and knowing; during the first sentence he turns his head slightly to the side as if sensing something in the room, then turns back to the camera; on the last word he gives a confident, enigmatic, charismatic smile and lifts one hand a little from the desk in a small elegant gesture, then lowers it"),
"t6":(7,"이제 걔가 네 편이야. 내일 아침부터 미션 보낼 거니까, 알림 켜 둬.","relaxed and cool; a slow head tilt to one side on the first sentence, a small turn of the head and back during the second, and on the last words a slow soft nod with a charming, slightly teasing half-smile and softened eyes"),
}
keys=sys.argv[1].split(',')
reqs=[]
for i,k in enumerate(keys):
    d,line,act=C[k]
    reqs.append({"index":i,"params":{"model":"kling3_0","mode":"pro","sound":"on","duration":d,"aspect_ratio":"9:16",
      "declined_preset_id":"24bae836-2c4a-48e0-89b6-49fcc0b21612",
      "medias":[{"value":IMG,"role":"start_image"}],
      "prompt":("The man speaks to the camera in Korean; his mouth clearly opens and closes, lips visibly moving in precise sync with every syllable, unhurried. "
        f'He says in Korean, exactly: "{line}" '
        f"Acting, relaxed and alive, his head moving gently and naturally the whole time like a real person in conversation: {act}. "+COMMON+VOICE)}})
print(json.dumps(reqs,ensure_ascii=False))
