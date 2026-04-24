#!/usr/bin/env python3
"""
AI-Friendliness & AEO Website Audit Tool

Usage:
    python aeo_audit.py https://www.greatlakesdental.com
    python aeo_audit.py https://www.greatlakesdental.com -c https://competitor.com
    python aeo_audit.py https://www.example.com -i Dental -a Allan -o report.pdf

Requirements:
    pip install requests beautifulsoup4 lxml reportlab
"""

import argparse, json, re, sys, os
from datetime import datetime
from urllib.parse import urljoin, urlparse

try:
    import requests
    from bs4 import BeautifulSoup
except ImportError:
    print("\n  pip install requests beautifulsoup4 lxml reportlab\n"); sys.exit(1)
try:
    from reportlab.lib.pagesizes import letter
    from reportlab.lib.units import inch
    from reportlab.lib.colors import HexColor
    from reportlab.lib.styles import ParagraphStyle
    from reportlab.lib.enums import TA_LEFT, TA_CENTER
    from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable)
except ImportError:
    print("\n  pip install reportlab\n"); sys.exit(1)

UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
TIMEOUT = 15
RED=HexColor("#F43F5E"); RED_LT=HexColor("#FEF2F2"); AMBER=HexColor("#F59E0B")
GREEN=HexColor("#10B981"); GREEN_LT=HexColor("#ECFDF5"); BLUE=HexColor("#3B82F6"); BLUE_LT=HexColor("#EFF6FF")
DARK=HexColor("#1A1A2E"); SLATE_LT=HexColor("#94A3B8"); GRAY_LT=HexColor("#F1F5F9")
BORDER=HexColor("#E2E8F0"); ACCENT=HexColor("#818CF8"); WHITE=HexColor("#FFFFFF"); TEXT=HexColor("#374151")
BANDS=[(0,30,"AI-Invisible",RED),(31,55,"AI-Fragile",AMBER),(56,75,"AI-Aware",HexColor("#EAB308")),(76,90,"AI-Friendly",GREEN),(91,100,"AI-Optimized",BLUE)]
def get_band(s):
    v=round(s)
    for mn,mx,l,c in BANDS:
        if mn<=v<=mx: return l,c
    return "AI-Invisible",RED

def fetch(url, allow_fail=False):
    try:
        r=requests.get(url,headers=UA,timeout=TIMEOUT,allow_redirects=True)
        if r.status_code==200: return r,None
        return (None if allow_fail else r),f"HTTP {r.status_code}"
    except: return None,"ERROR"

def fetch_inner(base_url, soup, n=5):
    pages,seen=[],set(); pb=urlparse(base_url)
    for a in soup.find_all("a",href=True):
        full=urljoin(base_url,a["href"]); p=urlparse(full)
        if p.netloc!=pb.netloc or p.path in seen or p.path in ("/",""): continue
        if any(p.path.endswith(e) for e in [".pdf",".jpg",".png",".zip",".css",".js"]): continue
        pri=0; pl=p.path.lower()
        if any(k in pl for k in ["service","about","team","doctor","treatment","practice"]): pri=2
        elif any(k in pl for k in ["contact","faq","blog","review","pricing"]): pri=1
        seen.add(p.path); pages.append((pri,full))
    pages.sort(key=lambda x:-x[0]); results=[]
    for _,u in pages[:n]:
        r,_=fetch(u,allow_fail=True)
        if r:
            try: results.append({"url":u,"soup":BeautifulSoup(r.text,"lxml"),"resp":r})
            except: pass
    return results


# ============================================================================
# CONTEXT — extract real info for site-specific critique
# ============================================================================
def get_context(base_url, soup, ftl, industry=""):
    ctx = {"domain": urlparse(base_url).netloc.replace("www.","")}
    t = soup.find("title")
    raw = t.get_text(strip=True) if t else ctx["domain"]
    og = soup.find("meta",property="og:title")
    if og: raw = og.get("content",raw)
    ctx["name"] = re.split(r'\s*[\|\-\u2013\u2014]\s*(home|welcome|main|official)',raw,flags=re.I)[0].strip()[:50]
    full_text = soup.get_text()
    m = re.search(r'([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?),\s*([A-Z]{2})\s+\d{5}', full_text)
    if m: ctx["city"]=m.group(1)
    else:
        m2 = re.search(r'(?:located in|serving|in)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)', full_text)
        ctx["city"]=m2.group(1).strip() if m2 else ""
    ctx["ind"]=industry.lower() if industry else ""
    if not ctx["ind"]:
        if any(k in ftl for k in ["dentist","dental"]): ctx["ind"]="dental"
        elif any(k in ftl for k in ["aesthet","botox","medspa","med spa","filler"]): ctx["ind"]="aesthetic"
        elif any(k in ftl for k in ["mechanic","auto","garage","brake","oil change"]): ctx["ind"]="automotive"
        elif any(k in ftl for k in ["handyman","plumb","electrical","appliance"]): ctx["ind"]="home services"
        elif any(k in ftl for k in ["attorney","law firm","legal"]): ctx["ind"]="legal"
        else: ctx["ind"]="services"
    c=ctx["city"] or "[city]"; i=ctx["ind"]
    if "dent" in i: ctx["q"]=[f"best dentist in {c}",f"how much do dental implants cost in {c}",f"emergency dentist near me",f"dentist {c} that takes my insurance",f"teeth whitening cost {c}"]
    elif "aesthet" in i: ctx["q"]=[f"best Botox clinic in {c}",f"lip filler cost {c}",f"med spa near me",f"coolsculpting vs lipo {c}",f"best anti-aging treatment {c}"]
    elif "auto" in i: ctx["q"]=[f"mechanic near me",f"brake repair cost {c}",f"best auto shop {c}",f"check engine light {c}",f"oil change near me open now"]
    elif "home" in i: ctx["q"]=[f"handyman near me",f"appliance repair {c} same day",f"how much to fix a leaky faucet {c}",f"emergency plumber {c}",f"best handyman {c}"]
    else: ctx["q"]=[f"best {i} in {c}",f"{i} near me",f"how much does {i} cost {c}",f"{i} {c} reviews",f"top rated {i} {c}"]
    svcs=[]
    for k in ["implant","crown","cleaning","whitening","braces","veneer","botox","filler","laser","facial","oil change","brake","tire","repair","plumbing","electrical","roofing"]:
        if k in ftl: svcs.append(k)
    ctx["svcs"]=svcs[:6]
    ctx["h2s"]=[h.get_text(strip=True) for h in soup.find_all("h2")][:8]
    return ctx


# ============================================================================
# ANALYSIS — scoring engine + Chandana-style natural critique findings
# ============================================================================
def analyze(base_url, soup, resp, inner, industry=""):
    all_s=[("home",soup)]+[(p["url"],p["soup"]) for p in inner]
    full_text=" ".join(s.get_text() for _,s in all_s)
    ftl=full_text.lower()
    fhtml=" ".join(str(s) for _,s in all_s).lower()
    parsed=urlparse(base_url); domain=f"{parsed.scheme}://{parsed.netloc}"
    ctx=get_context(base_url,soup,ftl,industry)
    F=[]  # findings
    scores={}
    c=ctx["city"] or "[city]"  # shorthand for query examples

    # ── 1. SCHEMA ──────────────────────────────────────────────────────
    schemas=[]
    pg_w=0
    for _,s in all_s:
        scr=s.find_all("script",type="application/ld+json")
        if scr: pg_w+=1
        for sc in scr:
            try:
                d=json.loads(sc.string); schemas.extend(d if isinstance(d,list) else [d])
            except: pass
    stypes=set()
    for s in schemas:
        t=s.get("@type","")
        if isinstance(t,list): stypes.update(t)
        else: stypes.add(t)
    stxt=json.dumps(schemas).lower() if schemas else ""
    biz_types=["LocalBusiness","Organization","Dentist","Attorney","Physician","MedicalBusiness","ProfessionalService","Restaurant","AutomotiveBusiness","HomeAndConstructionBusiness","HealthAndBeautyBusiness"]
    has_biz=any(t in stypes for t in biz_types)
    has_faq_s="FAQPage" in stypes or "faqpage" in stxt
    has_rating="aggregaterating" in stxt or "AggregateRating" in stypes
    has_svc="Service" in stypes or '"service"' in stxt
    has_bread="BreadcrumbList" in stypes; has_hours="openinghours" in stxt
    specific=stypes-{"LocalBusiness","Organization","WebSite","WebPage","BreadcrumbList","SearchAction","ItemList","ListItem","ImageObject","Person"}
    coverage=(pg_w/max(len(all_s),1))*100
    sc=[10 if has_biz else 0, 10 if specific else (3 if has_biz else 0), 10 if has_svc else 0,
        10 if has_faq_s else 0, 10 if has_rating else 0, 10 if has_bread else 0, 10 if has_hours else 0,
        8 if schemas and all(x.get("@context") or x.get("@type") for x in schemas) else (0 if not schemas else 5),
        min(10,int(coverage/10)), 5]
    scores["Structured Data &amp; Schema"]=sum(sc)/(len(sc)*10)*100

    # ── 2. CONTENT ─────────────────────────────────────────────────────
    sc2=[]
    h_issues=sum(1 for _,s in all_s if len(s.find_all("h1"))!=1); sc2.append(max(0,10-h_issues*2))
    qh,th=0,0
    for _,s in all_s:
        for t in s.find_all(["h2","h3"]):
            tx=t.get_text(strip=True); th+=1
            if tx.endswith("?") or tx.lower().startswith(("what","how","why","when","where","who","can","is","are","should")): qh+=1
    sc2.append(min(10,int((qh/max(th,1))*100/5)))
    da,hc=0,0
    for _,s in all_s:
        for h in s.find_all(["h2","h3"]):
            hc+=1; nxt=h.find_next_sibling(["p","div"])
            if nxt and 20<len(nxt.get_text(strip=True))<500: da+=1
    sc2.append(min(10,int((da/max(hc,1))*12)))
    words=full_text.split()
    caps=sum(1 for i,w in enumerate(words) if i>0 and w[0:1].isupper() and not words[i-1].endswith(".") and len(w)>2)
    sc2.append(min(10,int((caps/max(len(words),1))*200)))
    tpl=sum(1 for p in ["lorem ipsum","your company name","insert text here","sample text","we are a leading"] if p in ftl)
    sc2.append(max(0,10-tpl*3))
    wcs=[len(p["soup"].get_text().split()) for p in inner] or [len(full_text.split())]
    avg_wc=sum(wcs)/len(wcs)
    sc2.append(10 if avg_wc>=500 else (8 if avg_wc>=400 else (5 if avg_wc>=250 else (3 if avg_wc>=100 else 0))))
    sc2.append(min(10,len(inner)*2))
    auth=sum(1 for _,s in all_s if any(k in s.get_text().lower() for k in ["written by","author:","dr.","dds","dmd","esq","md","credentials"]))
    sc2.append(min(10,auth*3))
    il=sum(1 for _,s in all_s for a in s.find_all("a",href=True) if a["href"].startswith("/"))
    sc2.append(min(10,int(il/max(len(all_s),1)/3)))
    cy=str(datetime.now().year); ly=str(datetime.now().year-1)
    fresh=sum(1 for _,s in all_s if cy in s.get_text() or ly in s.get_text())
    sc2.append(min(10,fresh*3))
    scores["Content Architecture"]=sum(sc2)/(len(sc2)*10)*100

    # ── 3. TECHNICAL ───────────────────────────────────────────────────
    sc3=[]
    title_tag=soup.find("title"); ttxt=title_tag.get_text(strip=True) if title_tag else ""
    sc3.append(10 if 10<len(ttxt)<60 else (5 if ttxt else 0))
    md=soup.find("meta",attrs={"name":"description"}); dtxt=md.get("content","") if md else ""
    sc3.append(10 if 50<len(dtxt)<160 else (5 if dtxt else 0))
    og=soup.find_all("meta",property=re.compile(r"^og:")); sc3.append(10 if len(og)>=2 else (5 if og else 0))
    sc3.append(10 if soup.find("link",rel="canonical") else 0)
    sm,_=fetch(domain+"/sitemap.xml",allow_fail=True); sc3.append(10 if sm and "xml" in sm.text[:500].lower() else 0)
    rb,_=fetch(domain+"/robots.txt",allow_fail=True); ai_blocked=False
    if rb:
        rbl=rb.text.lower(); blocked=[b for b in ["gptbot","claudebot","ccbot","google-extended"] if b in rbl and "disallow" in rbl]
        if blocked: ai_blocked=True
    sc3.append(0 if ai_blocked else (10 if rb else 5))
    lt=resp.elapsed.total_seconds() if resp else 5
    sc3.append(10 if lt<1 else (8 if lt<2 else (5 if lt<4 else 3)))
    sc3.append(10 if soup.find("meta",attrs={"name":"viewport"}) else 0)
    sc3.append(10 if base_url.startswith("https") else 0)
    messy=sum(1 for a in soup.find_all("a",href=True) if "?" in a["href"] and any(p in a["href"].lower() for p in ["id=","page=","cat="]))
    sc3.append(max(0,10-messy))
    scores["Technical AI Visibility"]=sum(sc3)/(len(sc3)*10)*100

    # ── 4. AEO ─────────────────────────────────────────────────────────
    sc4=[]
    faq_sig=sum(1 for _,s in all_s if "frequently asked" in s.get_text().lower() or "faq" in s.get_text().lower())
    sc4.append(min(10,faq_sig*3))
    qblocks=sum(1 for _,s in all_s for t in s.find_all(["h2","h3","p","li"]) if t.get_text(strip=True).endswith("?") and len(t.get_text(strip=True))>15)
    sc4.append(min(10,qblocks))
    cite=sum(1 for _,s in all_s for p in s.find_all("p") if 40<len(p.get_text(strip=True))<300 and any(ch.isdigit() for ch in p.get_text()))
    sc4.append(min(10,cite//2))
    comp_sig=sum(1 for k in ["vs","versus","compared to","why choose","difference between"] if k in ftl)
    sc4.append(min(10,comp_sig*3))
    loc=sum(1 for k in ["near me","in your area","local","located in","serving"] if k in ftl)
    for _,s in all_s:
        for h in s.find_all(["h1","h2","h3"]):
            if any(k in h.get_text().lower() for k in ["in ","near ","serving "]): loc+=1
    sc4.append(min(10,loc*2))
    conv=sum(1 for k in ["you'll","we'll","you're","we're","let's","here's","your ","you "] if k in ftl)
    formal=sum(1 for k in ["hereby","aforementioned","pursuant","whereas"] if k in ftl)
    sc4.append(min(10,int(conv/max(conv+formal,1)*10)))
    stats=sum(1 for k in ["percent","success rate","satisfaction","years of experience","patients","rated"] if k in ftl)
    sc4.append(min(10,stats*2))
    geo=sum(1 for k in ["near me","neighborhood","community","downtown","directions","map"] if k in ftl)
    sc4.append(min(10,geo*2))
    cplx=sum(1 for w in ftl.split() if len(w)>12); cpct=cplx/max(len(ftl.split()),1)*100
    sc4.append(10 if cpct<3 else (8 if cpct<5 else (5 if cpct<8 else 3)))
    imgs=len(soup.find_all("img")); vids=len(soup.find_all(["video","iframe"]))
    sc4.append(10 if imgs>5 and vids>0 else (8 if imgs>5 else (5 if imgs>2 else 0)))
    scores["Answer Engine Optimization"]=sum(sc4)/(len(sc4)*10)*100

    # ── 5. CONVERSATIONAL ──────────────────────────────────────────────
    sc5=[]
    chat_kws=["tidio","intercom","drift","hubspot","livechat","zendesk","tawk","crisp","freshchat","olark","chatbot","chat-widget","webchat","live-chat","chatra"]
    has_chat=any(k in fhtml for k in chat_kws)
    sc5.append(10 if has_chat else 0); sc5.append(5 if has_chat else 0)
    forms=soup.find_all("form")
    book_kws=["book-appointment","schedule","calendly","acuity","booking","reserve","request-appointment"]
    has_book=any(k in fhtml for k in book_kws)
    sc5.append(10 if forms and has_book else (8 if has_book else (5 if forms else 0)))
    aon=any(k in ftl for k in ["24/7","24 hours","always available","after hours","emergency"])
    sc5.append(8 if aon and has_chat else (5 if aon or has_chat else 0))
    sc5.append(10 if has_book else 0)
    cas=sum(1 for k in ["you'll","we'll","we're","you're","let's","feel free","don't","can't"] if k in ftl)
    sc5.append(min(10,cas))
    phone=bool(re.search(r'[\(]?\d{3}[\)]?[-.\s]?\d{3}[-.\s]?\d{4}',soup.get_text()))
    email=bool(re.search(r'[\w.-]+@[\w.-]+\.\w+',soup.get_text()))
    sc5.append(10 if phone and email else (5 if phone or email else 0))
    ws=sum(1 for _,s in all_s if len(s.find_all("h2"))>=3 and len(s.find_all("p"))>=5)
    sc5.append(min(10,ws*2))
    ch_count=sum([phone,email,bool(forms),has_chat]); sc5.append(min(10,ch_count*2))
    rc=any(k in ftl for k in ["respond within","response time","get back to you","within 24 hours"])
    sc5.append(8 if rc else 0)
    scores["Conversational AI Readiness"]=sum(sc5)/(len(sc5)*10)*100

    # ── 6. E-E-A-T ────────────────────────────────────────────────────
    sc6=[]
    bio=sum(1 for k in ["meet the team","our team","our doctors","about dr","biography","years of experience","graduated from","board certified"] if k in ftl)
    sc6.append(min(10,bio*2))
    cert=sum(1 for k in ["certified","accredited","licensed","member of","fellow of","board certified","association","academy"] if k in ftl)
    sc6.append(min(10,cert*2))
    rev=sum(1 for k in ["review","testimonial","patient says","stars","rated","google review"] if k in ftl)
    sc6.append(min(10,rev*2))
    case=sum(1 for k in ["before and after","case study","gallery","portfolio","results","success story"] if k in ftl)
    sc6.append(min(10,case*3))
    blog_present=any(k in fhtml for k in ["blog","article","resource","news","insights","library"])
    sc6.append(10 if blog_present else 0)
    award=sum(1 for k in ["award","best of","top rated","winner","recognition","excellence"] if k in ftl)
    sc6.append(min(10,award*3))
    price=any(k in ftl for k in ["pricing","cost","fee","starting at","affordable","financing","payment plan"])
    sc6.append(8 if price else 0)
    compl=sum(1 for k in ["privacy policy","terms of service","hipaa","gdpr","compliance","disclaimer"] if k in ftl)
    sc6.append(min(10,compl*3))
    gmap=any(k in fhtml for k in ["google.com/maps","maps.google","goo.gl/maps"])
    addr=bool(re.search(r'\d{1,5}\s+\w+\s+(st|ave|blvd|rd|dr|ln|ct|way|pkwy|pl)',ftl))
    sc6.append(10 if gmap and addr else (5 if gmap or addr else 0))
    plat=sum(1 for k in ["google.com/maps","yelp.com","healthgrades","zocdoc","bbb.org","trustpilot"] if k in fhtml)
    sc6.append(min(10,plat*3))
    scores["E-E-A-T &amp; Trust Signals"]=sum(sc6)/(len(sc6)*10)*100

    # ===================================================================
    # FINDINGS — Chandana style: short, varied, natural, query-grounded
    # ===================================================================

    # ── HERO — consolidated into 2-3 natural observations max ──────────
    hero_el=(soup.find(class_=re.compile(r"hero|banner|masthead|jumbotron|slider|carousel|swiper|owl-carousel|slick|home-banner|main-banner|top-section|intro",re.I))
             or soup.find("header") or soup.find("main"))
    ht=hero_el.get_text(" ",strip=True).lower() if hero_el else ""

    is_slider=bool(soup.find(class_=re.compile(r"slider|carousel|swiper|owl-carousel|slick-slide|flexslider",re.I)))
    id_kws=["dentist","dental","clinic","law firm","attorney","garage","mechanic","repair","aesthetics","medspa","med spa","wellness","plumber","handyman","contractor","orthodont","implant","pediatric","family","cosmetic","urgent care","chiropract"]
    svc_kws_hero=["implant","crown","cleaning","whitening","extraction","root canal","braces","veneer","botox","filler","laser","facial","peel","coolsculpt","repair","installation","oil change","brake","tire","diagnos","consultation","treatment"]
    aud_kws=["families","adults","children","seniors","patients","homeowners","businesses","new patients","emergency","walk-in","same day","first visit","all ages"]
    cost_kws=["starting at","from $","free consult","free estimate","affordable","$","cost","financing","insurance","complimentary","free quote"]
    trust_kws=["years","established","certified","board certified","award","rated","5-star","five star","licensed","patients served","guarantee"]

    hero_id = any(k in ht for k in id_kws) and len(ht)>20
    hero_svc = sum(1 for k in svc_kws_hero if k in ht)>=2
    hero_aud = any(k in ht for k in aud_kws)
    hero_cost = any(k in ht for k in cost_kws)
    hero_trust = sum(1 for k in trust_kws if k in ht)>=1

    # Check center alignment
    center=False
    if hero_el:
        hstyle=hero_el.get("style",""); hcls=" ".join(hero_el.get("class",[]))
        csigs=["text-center","text-align:center","text-align: center","mx-auto","center-align","centered","align-center"]
        if any(cs in hstyle.lower() or cs in hcls.lower() for cs in csigs): center=True
        hh=hero_el.find(["h1","h2"])
        if hh:
            ac=f'{hh.get("style","")} {" ".join(hh.get("class",[]))} {" ".join(hh.parent.get("class",[]) if hh.parent else [])}'.lower()
            if any(cs in ac for cs in csigs): center=True

    # Build 2-3 consolidated hero findings (Chandana style)
    hero_problems = sum([is_slider, not hero_id, not hero_svc, not hero_aud, not hero_cost, not hero_trust, center])
    if hero_problems >= 3:
        # Big hero problem — consolidate into one strong finding
        parts = []
        if is_slider: parts.append("rotating image banner")
        elif not hero_id: parts.append("nothing specific about the business")
        if not hero_svc: parts.append("no services named")
        if not hero_aud: parts.append("no audience")
        if not hero_cost: parts.append("no cost signal")
        if not hero_trust: parts.append("no trust signal")

        if is_slider:
            F.append(f'Hero is a rotating image banner. AI cannot map to any queries like "{ctx["q"][0]}" or "{ctx["q"][1]}". No strong location signal.')
        elif not hero_id:
            F.append(f'Hero has nothing specific. AI cannot map to any queries like "{ctx["q"][0]}" or "{ctx["q"][1]}". No strong location signal.')
        else:
            F.append(f'Hero headline is vague. Doesn\'t say what they do or who they serve.')

        if center:
            F.append("Homepage is visual, not informational. Center-aligned content is difficult for AI to read.")

        # Add one more specific missing element
        if not hero_cost and not hero_trust:
            F.append("No cost signal and no trust signal in the hero. The two things people ask AI first.")
        elif not hero_cost:
            F.append(f'No cost signal. AI cannot answer "{ctx["q"][1]}" from the hero.')
        elif not hero_trust:
            F.append("No trust signal in the hero. No years, no ratings, no credentials.")
    elif hero_problems >= 1:
        if is_slider:
            F.append("Hero is a rotating image slider. AI cannot read it.")
        if not hero_id and not is_slider:
            F.append(f'Hero headline is vague. Doesn\'t say what they do or who they serve.')
        if center:
            F.append("Homepage is visual, not informational. Center-aligned content is difficult for AI to read.")

    # ── STRUCTURED DATA ────────────────────────────────────────────────
    if not has_biz:
        F.append("No structured data. AI cannot identify what this business is, what it does, or where it is.")
    if not has_faq_s:
        # Don't repeat if we have a separate "no FAQs" finding below
        pass
    if not has_rating:
        F.append("No review markup. There might be stars on the page, but AI cannot read them.")
    if not has_svc and has_biz:
        F.append("No service-level structured data. AI cannot connect specific services to this business.")

    # ── CONTENT ISSUES ─────────────────────────────────────────────────
    if (qh/max(th,1))*100 < 10:
        F.append(f'Headings are generic, not question-based. Nobody on this site is asking "what does {ctx["svcs"][0] if ctx["svcs"] else "this"} cost?" or "what should I expect?"')

    if avg_wc < 300:
        F.append(f"Service pages are {int(avg_wc)}-word summaries. 1-3 sentences each. Not enough for AI to treat as a real source.")
    elif avg_wc < 200:
        F.append(f"Service pages are barely there. ~{int(avg_wc)} words average. AI skips these entirely.")

    # Scattered services
    svc_pages=[p for p in inner if any(k in p["url"].lower() for k in ["service","treatment","procedure"])]
    if svc_pages:
        short_svcs=[p for p in svc_pages if len(p["soup"].get_text().split())<200]
        if len(short_svcs)>len(svc_pages)/2:
            F.append("Services are scattered and shallow. no hierarchy.")

    # About density
    about_pages=[p for p in inner if "about" in p["url"].lower()]
    if about_pages:
        long_paras=[p for p in about_pages[0]["soup"].find_all("p") if len(p.get_text(strip=True))>400]
        if long_paras:
            F.append("About section is too dense. long paragraph. mixed info.")

    # Blogs
    blog_pages=[p for p in inner if any(k in p["url"].lower() for k in ["blog","article","news","post"])]
    if blog_pages:
        blog_links_to_svc=any(any(k in str(p["soup"]).lower() for k in ["service","treatment","book","schedule","appointment"]) for p in blog_pages)
        if not blog_links_to_svc:
            F.append("Blogs are generic articles and not related to services and not structured.")
    elif not blog_present:
        F.append("No blog or educational content.")

    # ── AEO ISSUES ─────────────────────────────────────────────────────
    if faq_sig==0:
        F.append("no FAQs.")

    if cite<3:
        F.append(f'Nothing quotable. When someone asks "{ctx["q"][0]}", AI has no clean answer block to pull from this site.')

    if loc<2:
        F.append(f'No dominant location signal. AI cannot confidently recommend for "{ctx["q"][0]}".')
    elif loc<4:
        F.append(f'Location is present but weakly used. Not paired with services.')

    if comp_sig==0:
        F.append("No comparison content. no 'X vs Y' pages. AI has nothing for 'which is better' questions.")

    # ── CONVERSATIONAL ISSUES ──────────────────────────────────────────
    if not has_chat:
        F.append("No chat, no chatbot, no way to engage after hours.")

    if not has_book:
        F.append("No online booking. Only way to schedule is to call.")

    if ai_blocked:
        bl=", ".join(blocked)
        F.append(f"Robots.txt is blocking AI crawlers ({bl}). The site is deliberately invisible.")

    # ── E-E-A-T ISSUES ─────────────────────────────────────────────────
    if bio<2:
        F.append("Team bios are thin or missing. no credentials, no education, no reason for AI to trust this source.")

    if not price:
        F.append(f'No pricing info anywhere. AI cannot answer "{ctx["q"][1]}".')

    if plat==0:
        F.append("No links to Google Reviews, Yelp, or any external review platform.")

    # ── SITE-WIDE PATTERNS ─────────────────────────────────────────────
    if not any(k in ftl for k in ["why choose","why us","what sets us apart","our difference"]):
        F.append('No structured "why choose us."')

    if not any(k in ftl for k in ["who we serve","who this is for","our patients","our clients","ideal for"]):
        F.append('No clear "who this is for."')

    # Vague copy
    vague=sum(1 for k in ["quality care","beautiful smiles","your satisfaction","trusted partner","we are committed","excellence in","dedicated to providing","our mission is","passionate about"] if k in ftl)
    if vague>=2:
        F.append("Website copy is vague and not useful. Generic phrases everywhere.")
    elif vague==1:
        F.append("Website copy leans on filler. not enough substance for AI.")

    # Emotional overload
    emo=sum(1 for k in ["passionate","heartfelt","love what we do","like family","warm and welcoming","from the heart","caring touch","feel at home","we truly care","your comfort"] if k in ftl)
    if emo>=3:
        F.append("Too much emotional language, not enough facts.")

    # Intent mapping
    intent_kws=["how much","what to expect","do i need","should i","is it worth","how long does","what is the process"]
    if sum(1 for k in intent_kws if k in ftl)<2:
        F.append(f'No query-level language. The site never addresses how someone would actually ask AI: "{ctx["q"][2]}" or "{ctx["q"][3]}". Built for SEO, not the AI layer.')

    # Urgency
    if not any(k in ftl for k in ["same day","same-day","emergency","urgent","open now","walk-in","no wait","immediate"]):
        F.append("No urgency / decision signals. No same-day, no emergency, no walk-in.")

    # No conversational structure
    if cas<3 and not has_chat:
        F.append("No conversational / AI-friendly structure. Content reads like a brochure, not a conversation.")

    # ── TOTAL ──────────────────────────────────────────────────────────
    weights={"Structured Data &amp; Schema":20,"Content Architecture":20,"Technical AI Visibility":15,
             "Answer Engine Optimization":20,"Conversational AI Readiness":10,"E-E-A-T &amp; Trust Signals":15}
    total=sum(scores[k]*(weights[k]/100) for k in scores)

    # Deduplicate and cap findings
    seen_starts=set(); deduped=[]
    for f in F:
        start=f[:25].lower()
        if start not in seen_starts:
            seen_starts.add(start); deduped.append(f)
    F=deduped[:12]  # Cap at 12 — tight, focused, Chandana-length

    return {"total":total,"scores":scores,"weights":weights,"findings":F,"ctx":ctx}


# ============================================================================
# PDF REPORT
# ============================================================================
def make_pdf(data, url, path, industry="", auditor="", comp=None, comp_url=""):
    W=letter[0]-1.4*inch
    sBul=ParagraphStyle("Bul",fontName="Helvetica",fontSize=10,leading=15,textColor=TEXT,leftIndent=16,spaceAfter=6,bulletIndent=0)
    sBulG=ParagraphStyle("BulG",fontName="Helvetica",fontSize=10,leading=15,textColor=TEXT,leftIndent=16,spaceAfter=6,bulletIndent=0)
    sTag=ParagraphStyle("Tag",fontName="Helvetica-Bold",fontSize=8,textColor=RED,alignment=TA_CENTER,spaceAfter=10)
    sTitle=ParagraphStyle("Title",fontName="Helvetica-Bold",fontSize=26,leading=32,textColor=DARK,alignment=TA_CENTER,spaceAfter=4)
    sSub=ParagraphStyle("Sub",fontName="Helvetica",fontSize=11,leading=16,textColor=SLATE_LT,alignment=TA_CENTER,spaceAfter=24)
    sCat=ParagraphStyle("Cat",fontName="Helvetica-Bold",fontSize=18,leading=24,textColor=DARK,spaceAfter=14)
    sURL=ParagraphStyle("URL",fontName="Helvetica-Bold",fontSize=11,textColor=ACCENT,spaceAfter=4)
    sH1=ParagraphStyle("H1",fontName="Helvetica-Bold",fontSize=16,leading=22,textColor=DARK,spaceBefore=20,spaceAfter=10)
    sFoot=ParagraphStyle("Foot",fontName="Helvetica-Bold",fontSize=10,textColor=HexColor("#334155"),alignment=TA_CENTER)
    sFootS=ParagraphStyle("FootS",fontName="Helvetica",fontSize=9,textColor=SLATE_LT,alignment=TA_CENTER)
    sFootP=ParagraphStyle("FootP",fontName="Helvetica",fontSize=9,textColor=ACCENT,alignment=TA_CENTER)
    sSmall=ParagraphStyle("Small",fontName="Helvetica",fontSize=8,textColor=SLATE_LT,alignment=TA_CENTER)

    doc=SimpleDocTemplate(path,pagesize=letter,topMargin=0.55*inch,bottomMargin=0.55*inch,leftMargin=0.7*inch,rightMargin=0.7*inch)
    story=[]; band_label,band_color=get_band(data["total"]); ctx=data.get("ctx",{})

    # Cover
    story.append(Spacer(1,30))
    story.append(Paragraph("AI READINESS AUDIT",sTag))
    story.append(Paragraph("Website AI Visibility<br/>Assessment Report",sTitle))
    story.append(Paragraph("Website-by-website critique of AI-friendliness and answer engine visibility.",sSub))
    meta=[["WEBSITE","INDUSTRY","AUDITED BY","DATE"],[url,industry or ctx.get("ind","N/A").title(),auditor or "Automated",datetime.now().strftime("%B %d, %Y")]]
    mt=Table(meta,colWidths=[W/4]*4)
    mt.setStyle(TableStyle([("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),("FONTSIZE",(0,0),(-1,0),7),("TEXTCOLOR",(0,0),(-1,0),SLATE_LT),("FONTNAME",(0,1),(-1,1),"Helvetica-Bold"),("FONTSIZE",(0,1),(-1,1),9),("TEXTCOLOR",(0,1),(-1,1),DARK),("BACKGROUND",(0,0),(-1,-1),GRAY_LT),("BOX",(0,0),(-1,-1),0.5,BORDER),("LINEBELOW",(0,0),(-1,0),0.5,BORDER),("TOPPADDING",(0,0),(-1,-1),8),("BOTTOMPADDING",(0,0),(-1,-1),8),("LEFTPADDING",(0,0),(-1,-1),12),("ROUNDEDCORNERS",[6,6,6,6])]))
    story.append(mt); story.append(Spacer(1,20))

    # Score + band
    verdict=Table([[Paragraph(str(round(data["total"])),ParagraphStyle("VN",fontName="Helvetica-Bold",fontSize=48,textColor=band_color,alignment=TA_CENTER)),
        Paragraph(f"<b><font color='#{band_color.hexval()[2:]}'>{band_label}</font></b><br/><font size=9 color='#94A3B8'>out of 100</font>",ParagraphStyle("VL",fontName="Helvetica-Bold",fontSize=14,textColor=DARK,leading=20)),
    ]],colWidths=[1.2*inch,W-1.2*inch])
    verdict.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,-1),GRAY_LT),("BOX",(0,0),(-1,-1),0.5,BORDER),("TOPPADDING",(0,0),(-1,-1),16),("BOTTOMPADDING",(0,0),(-1,-1),16),("LEFTPADDING",(0,0),(-1,-1),16),("VALIGN",(0,0),(-1,-1),"MIDDLE"),("ROUNDEDCORNERS",[8,8,8,8])]))
    story.append(verdict); story.append(Spacer(1,20))

    # Section scores
    story.append(Paragraph("Section Scores",sH1))
    rows=[["Section","Score","Weight","Weighted"]]
    for name,pct in data["scores"].items():
        w=data["weights"][name]; rows.append([name.replace("&amp;","&"),f"{round(pct)}/100",f"{w}%",str(round(pct*w/100))])
    rows.append(["TOTAL",f"{round(data['total'])}/100","100%",str(round(data['total']))])
    st=Table(rows,colWidths=[W*0.44,W*0.18,W*0.18,W*0.20])
    st.setStyle(TableStyle([("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),("FONTSIZE",(0,0),(-1,0),8),("TEXTCOLOR",(0,0),(-1,0),SLATE_LT),("BACKGROUND",(0,0),(-1,0),GRAY_LT),("FONTNAME",(0,1),(-1,-2),"Helvetica"),("FONTSIZE",(0,1),(-1,-2),9),("TEXTCOLOR",(0,1),(-1,-2),TEXT),("FONTNAME",(0,-1),(-1,-1),"Helvetica-Bold"),("FONTSIZE",(0,-1),(-1,-1),10),("BACKGROUND",(0,-1),(-1,-1),GRAY_LT),("BOX",(0,0),(-1,-1),0.5,BORDER),("LINEBELOW",(0,0),(-1,-2),0.3,BORDER),("TOPPADDING",(0,0),(-1,-1),7),("BOTTOMPADDING",(0,0),(-1,-1),7),("LEFTPADDING",(0,0),(-1,-1),10),("ALIGN",(1,0),(-1,-1),"CENTER"),("ROUNDEDCORNERS",[6,6,6,6])]))
    for i in range(1,len(rows)-1):
        v=int(rows[i][1].split("/")[0]); clr=RED if v<=30 else (AMBER if v<=55 else (GREEN if v>75 else HexColor("#EAB308")))
        st.setStyle(TableStyle([("TEXTCOLOR",(1,i),(1,i),clr)]))
    story.append(st)
    bl=" | ".join([f"<font color='#{clr.hexval()[2:]}'><b>{l}</b> ({mn}-{mx})</font>" for mn,mx,l,clr in BANDS])
    story.append(Spacer(1,6)); story.append(Paragraph(bl,sSmall))

    # Comparison
    if comp:
        story.append(PageBreak()); story.append(Paragraph("Competitive Comparison",sH1))
        cr=[["Section",url[:35],comp_url[:35],"Gap"]]
        for name in data["scores"]:
            p1=round(data["scores"][name]); p2=round(comp["scores"].get(name,0)); g=p1-p2
            cr.append([name.replace("&amp;","&"),str(p1),str(p2),f"{'+' if g>=0 else ''}{g}"])
        cr.append(["TOTAL",str(round(data["total"])),str(round(comp["total"])),f"{'+' if data['total']>=comp['total'] else ''}{round(data['total']-comp['total'])}"])
        ct=Table(cr,colWidths=[W*0.32,W*0.22,W*0.22,W*0.24])
        ct.setStyle(TableStyle([("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),("FONTSIZE",(0,0),(-1,0),8),("TEXTCOLOR",(0,0),(-1,0),SLATE_LT),("BACKGROUND",(0,0),(-1,0),GRAY_LT),("FONTNAME",(0,1),(-1,-1),"Helvetica"),("FONTSIZE",(0,1),(-1,-1),9),("FONTNAME",(0,-1),(-1,-1),"Helvetica-Bold"),("BACKGROUND",(0,-1),(-1,-1),GRAY_LT),("BOX",(0,0),(-1,-1),0.5,BORDER),("LINEBELOW",(0,0),(-1,-2),0.3,BORDER),("TOPPADDING",(0,0),(-1,-1),7),("BOTTOMPADDING",(0,0),(-1,-1),7),("LEFTPADDING",(0,0),(-1,-1),8),("ALIGN",(1,0),(-1,-1),"CENTER")]))
        story.append(ct)

    # ── FINDINGS — the critique page ───────────────────────────────────
    story.append(PageBreak())
    story.append(Paragraph(ctx.get("name",url),sCat))
    story.append(Paragraph(f"Website: {url}",sURL))
    story.append(Spacer(1,4))
    story.append(Paragraph("Why it's not AI Friendly:",ParagraphStyle("WhyL",fontName="Helvetica-Bold",fontSize=10,textColor=RED,spaceAfter=10)))

    card_items=[Paragraph(f,sBul,bulletText="\u2022") for f in data["findings"]]
    if card_items:
        card=Table([[card_items]],colWidths=[W-28])
        card.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,-1),WHITE),("BOX",(0,0),(-1,-1),0.5,BORDER),("TOPPADDING",(0,0),(-1,-1),16),("BOTTOMPADDING",(0,0),(-1,-1),16),("LEFTPADDING",(0,0),(-1,-1),18),("RIGHTPADDING",(0,0),(-1,-1),14),("ROUNDEDCORNERS",[8,8,8,8])]))
        story.append(card)

    # ── WHAT AI-READY SITES DO ─────────────────────────────────────────
    story.append(PageBreak())
    story.append(Paragraph("What AI-Ready Websites Do Differently",sCat))
    story.append(HRFlowable(width="100%",thickness=1,color=BORDER,spaceAfter=16))
    bps=[
        "Structured data that matches the actual business. not just generic markup. every service, every FAQ, every review is machine-readable.",
        "500+ words per service page. headings that mirror real questions people ask AI. direct answers in the first two sentences, not buried in paragraphs.",
        f'Strong location anchoring. "{ctx.get("city","the city")}" paired with every service throughout the site, not just in the footer or contact page.',
        'Clear "who this is for" and "why choose us" with real numbers. years in business, patients served, certifications. not claims. data.',
        "Chat or engagement that works after hours. when someone visits at 10pm they can still get answers and book.",
        "Provider profiles with real credentials. education, board certifications, specializations. gives AI a reason to cite this source.",
        f'Intent-matching content. every question a customer would ask AI ("{ctx.get("q",[""])[0]}", "{ctx.get("q",["",""])[1]}") has a dedicated, structured answer on the site.',
    ]
    bp_items=[Paragraph(b,sBulG,bulletText="\u2714") for b in bps]
    bp_card=Table([[bp_items]],colWidths=[W-28])
    bp_card.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,-1),GREEN_LT),("BOX",(0,0),(-1,-1),0.5,HexColor("#A7F3D0")),("TOPPADDING",(0,0),(-1,-1),18),("BOTTOMPADDING",(0,0),(-1,-1),18),("LEFTPADDING",(0,0),(-1,-1),18),("RIGHTPADDING",(0,0),(-1,-1),14),("ROUNDEDCORNERS",[8,8,8,8])]))
    story.append(bp_card)

    # Footer
    story.append(Spacer(1,36))
    story.append(HRFlowable(width="100%",thickness=0.5,color=BORDER,spaceAfter=14))
    story.append(Paragraph("Prepared by Upserv.ai",sFoot))
    story.append(Paragraph("An Iozera Company",sFootS))
    story.append(Spacer(1,4))
    story.append(Paragraph("Kriss.ai  |  Chatli.ai  |  Upserv.ai  |  Ageni.ai",sFootP))

    doc.build(story)


# ============================================================================
# CLI
# ============================================================================
def run_audit(url, industry=""):
    print(f"\n{'='*60}\n  AUDITING: {url}\n{'='*60}\n")
    if not url.startswith("http"): url="https://"+url
    print("[1/4] Fetching homepage..."); resp,err=fetch(url)
    if err and resp is None: print(f"\n  FATAL: {err}\n"); return None,url
    soup=BeautifulSoup(resp.text,"lxml")
    print("[2/4] Discovering inner pages..."); inner=fetch_inner(url,soup); print(f"       Found {len(inner)} inner pages")
    print("[3/4] Analyzing..."); data=analyze(url,soup,resp,inner,industry); print("[4/4] Done.\n")
    band_label,_=get_band(data["total"])
    print(f"  SCORE: {round(data['total'])}/100 - {band_label}\n")
    print(f"  Why it's not AI Friendly:")
    for f in data["findings"]:
        clean=re.sub('<[^>]+>','',f); print(f"  - {clean}")
    print()
    return data,url

def main():
    p=argparse.ArgumentParser(description="AI Audit Tool",epilog="Example: python aeo_audit.py https://www.greatlakesdental.com -i Dental")
    p.add_argument("url",help="Website URL"); p.add_argument("--compare","-c",default=None)
    p.add_argument("--industry","-i",default=""); p.add_argument("--auditor","-a",default="")
    p.add_argument("--output","-o",default="aeo_audit_report.pdf")
    args=p.parse_args()
    data,url=run_audit(args.url,args.industry)
    if not data: sys.exit(1)
    comp_data,comp_url=None,""
    if args.compare: comp_data,comp_url=run_audit(args.compare,args.industry)
    print("Generating PDF..."); make_pdf(data,url,args.output,args.industry,args.auditor,comp_data,comp_url)
    print(f"\n{'='*60}\n  SAVED: {os.path.abspath(args.output)}\n{'='*60}\n")

if __name__=="__main__": main()
