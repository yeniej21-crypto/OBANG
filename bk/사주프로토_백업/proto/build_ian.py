import re
s=open('seoha-salon.html').read()
IAN='''{id:'ian',name:'이안',intro:'v/ian/intro.mp4',introPoster:'img/ian_intro0.jpg',kicker:'서울 어느 옥상 · 이름 없는 정자',lead:'정자 안에서 누군가 기다리고 있다.',
  title:'이안의 살롱 체험판',brand:'IAN · SALON',clips:'v/ian/',poster:'img/ian.jpg',
  c1a:'(여기 어디지…?)',c1b:'(말없이 앉는다)',worry:'요즘 제일 걸리는 거, 말해봐.',pay:'이안의 상담 이어서 보기 · 29,000원',
  lines:{t1:['왔네.','기다리고 있었어.','이리 와서 앉아.'],t1a:['네 운명 알아보는 데야.','내 말 잘 들으면…','바꿀 수도 있고.'],t1b:['말 잘 듣네.','마음에 들어.'],
    t2:['태어난 날이랑 시간 알려줘.','시간은 몰라도 돼.'],t3:['…역시.','너, 한쪽 기운이','텅 비어 있어.'],t4:['요즘 제일 걸리는 거,','솔직하게 말해봐.'],
    t5:['비어 있는 그 기운,','채워줄 녀석이 있어.','불러볼게.'],t6:['이제 걔가 네 편이야.','내일 아침부터 미션 보낼 거니까,','알림 켜 둬.']},
  dur:{t1:4.8,t1a:5,t1b:2.9,t2:4.8,t3:3.8,t4:3.7,t5:5.5,t6:6}}'''
s=re.sub(r"/\*HOST\*/.*?/\*/HOST\*/","/*HOST*/"+IAN.replace('\\','\\\\')+"/*/HOST*/",s,flags=re.S)
open('ian-salon.html','w').write(s); print('built', len(s))
