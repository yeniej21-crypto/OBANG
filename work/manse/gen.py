import ephem, math, json, datetime as dt
from korean_lunar_calendar import KoreanLunarCalendar as K
def lon(t): return math.degrees(ephem.Ecliptic(ephem.Sun(t),epoch=t).lon)%360
def find(y,target,guess):
    # guess: (month, day) in UTC; bisection on sun longitude
    t0=ephem.Date(dt.datetime(y,*guess)-dt.timedelta(days=6)); t1=ephem.Date(t0+12)
    def f(t): return ((lon(t)-target+180)%360)-180
    a,b=t0,t1
    for _ in range(50):
        m=(a+b)/2
        if f(m)<0: a=m
        else: b=m
    return ephem.Date(b).datetime()+dt.timedelta(hours=9)  # KST
TERMS=[(285,(1,6)),(315,(2,4)),(345,(3,6)),(15,(4,5)),(45,(5,6)),(75,(6,6)),(105,(7,7)),(135,(8,8)),(165,(9,8)),(195,(10,8)),(225,(11,7)),(255,(12,7))]
EP=dt.datetime(1900,1,1)
jie={}
for y in range(1949,2032):
    row=[]
    for lo,g in TERMS:
        k=find(y,lo,g); row.append(int((k-EP).total_seconds()//60))
    jie[y]=row
# lunar table: for each lunar year, list of [month, leap, solarDayIndex] for month starts
lun={}
c=K()
for y in range(1950,2031):
    arr=[]
    for m in range(1,13):
        for leap in (False,True):
            ok=c.setLunarDate(y,m,1,leap)
            if not ok: continue
            s=c.SolarIsoFormat(); d=dt.date.fromisoformat(s)
            if leap:
                # verify it is really a leap month (library may return non-leap)
                c2=K(); c2.setSolarDate(d.year,d.month,d.day)
                if not c2.isIntercalation: continue
            arr.append([m,1 if leap else 0,(d-dt.date(1900,1,1)).days])
    lun[y]=arr
json.dump({'jie':jie,'lun':lun},open('manse.json','w'),separators=(',',':'))
print(len(json.dumps(jie)),len(json.dumps(lun)))
print([ (EP+dt.timedelta(minutes=x)).strftime('%m-%d %H:%M') for x in jie[2027]])
print(lun[2023])
