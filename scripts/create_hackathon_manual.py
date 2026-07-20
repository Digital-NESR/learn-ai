from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle,
    KeepTogether, Image, HRFlowable, Preformatted
)

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output" / "pdf"
OUT.mkdir(parents=True, exist_ok=True)
PDF = OUT / "nesr_ai_hackathon_beginner_manual.pdf"

NAVY = colors.HexColor("#0B1739")
BLUE = colors.HexColor("#176BFF")
CYAN = colors.HexColor("#14B8C4")
GREEN = colors.HexColor("#2E8B57")
ORANGE = colors.HexColor("#F36B21")
PALE = colors.HexColor("#F3F7FB")
MID = colors.HexColor("#D8E2EE")
INK = colors.HexColor("#172033")
MUTED = colors.HexColor("#53647A")
WHITE = colors.white

font_dir = Path("C:/Windows/Fonts")
if (font_dir / "aptos.ttf").exists():
    pdfmetrics.registerFont(TTFont("Body", str(font_dir / "aptos.ttf")))
    pdfmetrics.registerFont(TTFont("BodyBold", str(font_dir / "aptos-bold.ttf")))
else:
    pdfmetrics.registerFont(TTFont("Body", str(font_dir / "arial.ttf")))
    pdfmetrics.registerFont(TTFont("BodyBold", str(font_dir / "arialbd.ttf")))

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="TitleX", fontName="BodyBold", fontSize=30, leading=34, textColor=WHITE, spaceAfter=12))
styles.add(ParagraphStyle(name="SubX", fontName="Body", fontSize=13, leading=19, textColor=colors.HexColor("#D9E6FF")))
styles.add(ParagraphStyle(name="H1X", fontName="BodyBold", fontSize=22, leading=26, textColor=NAVY, spaceAfter=8))
styles.add(ParagraphStyle(name="H2X", fontName="BodyBold", fontSize=14, leading=18, textColor=NAVY, spaceBefore=8, spaceAfter=5))
styles.add(ParagraphStyle(name="BodyX", fontName="Body", fontSize=9.3, leading=13.2, textColor=INK, spaceAfter=5))
styles.add(ParagraphStyle(name="SmallX", fontName="Body", fontSize=7.8, leading=10.5, textColor=MUTED))
styles.add(ParagraphStyle(name="TinyX", fontName="Body", fontSize=6.8, leading=8.5, textColor=MUTED))
styles.add(ParagraphStyle(name="BulletX", fontName="Body", fontSize=9, leading=12.6, leftIndent=12, firstLineIndent=-7, textColor=INK, spaceAfter=3))
styles.add(ParagraphStyle(name="CallX", fontName="BodyBold", fontSize=10, leading=14, textColor=NAVY))
styles.add(ParagraphStyle(name="CodeX", fontName="Courier", fontSize=7.4, leading=10, textColor=INK, backColor=colors.HexColor("#EAF0F6"), borderPadding=7))

def P(text, style="BodyX"):
    return Paragraph(text, styles[style])

def code(text):
    return Preformatted(text, styles["CodeX"])

def bullets(items):
    return [P("&#8226; " + x, "BulletX") for x in items]

def box(title, body, color=BLUE):
    content = [P(title, "CallX"), Spacer(1, 2), P(body, "BodyX")]
    t = Table([[content]], colWidths=[169*mm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,-1), colors.HexColor("#F6F9FD")),
        ("BOX", (0,0), (-1,-1), 0.8, color),
        ("LINEBEFORE", (0,0), (0,-1), 4, color),
        ("LEFTPADDING", (0,0), (-1,-1), 10), ("RIGHTPADDING", (0,0), (-1,-1), 10),
        ("TOPPADDING", (0,0), (-1,-1), 8), ("BOTTOMPADDING", (0,0), (-1,-1), 6),
    ]))
    return t

def cards(items, widths=None):
    if widths is None: widths=[55*mm]*len(items)
    row=[]
    for title, body in items:
        row.append([P(title, "CallX"), Spacer(1,3), P(body, "SmallX")])
    t=Table([row], colWidths=widths, hAlign="LEFT")
    t.setStyle(TableStyle([
        ("BACKGROUND",(0,0),(-1,-1),PALE),("BOX",(0,0),(-1,-1),0.6,MID),
        ("INNERGRID",(0,0),(-1,-1),0.6,MID),("VALIGN",(0,0),(-1,-1),"TOP"),
        ("LEFTPADDING",(0,0),(-1,-1),8),("RIGHTPADDING",(0,0),(-1,-1),8),
        ("TOPPADDING",(0,0),(-1,-1),8),("BOTTOMPADDING",(0,0),(-1,-1),8),
    ]))
    return t

def matrix(headers, rows, widths):
    data=[[P(h,"CallX") for h in headers]] + [[P(str(c),"SmallX") for c in r] for r in rows]
    t=Table(data,colWidths=widths,repeatRows=1,hAlign="LEFT")
    t.setStyle(TableStyle([
        ("BACKGROUND",(0,0),(-1,0),NAVY),("TEXTCOLOR",(0,0),(-1,0),WHITE),
        ("GRID",(0,0),(-1,-1),0.5,MID),("VALIGN",(0,0),(-1,-1),"TOP"),
        ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE,PALE]),
        ("LEFTPADDING",(0,0),(-1,-1),6),("RIGHTPADDING",(0,0),(-1,-1),6),
        ("TOPPADDING",(0,0),(-1,-1),6),("BOTTOMPADDING",(0,0),(-1,-1),6),
    ]))
    return t

def page_title(kicker, title, intro=None):
    out=[P(kicker.upper(),"SmallX"), P(title,"H1X")]
    if intro: out.append(P(intro,"BodyX"))
    out.append(Spacer(1,3))
    return out

def footer(canvas, doc):
    canvas.saveState()
    w,h=A4
    canvas.setStrokeColor(MID); canvas.line(20*mm,14*mm,w-20*mm,14*mm)
    canvas.setFont("Body",7); canvas.setFillColor(MUTED)
    canvas.drawString(20*mm,9*mm,"NESR AI Prototyping Hackathon 2026 | Beginner Manual")
    canvas.drawRightString(w-20*mm,9*mm,str(doc.page))
    canvas.restoreState()

doc=SimpleDocTemplate(str(PDF),pagesize=A4,rightMargin=20*mm,leftMargin=20*mm,topMargin=18*mm,bottomMargin=19*mm,
                      title="NESR AI Prototyping Hackathon 2026 - Beginner Manual",author="NESR")
S=[]

# Cover
cover=Table([[[Spacer(1,22*mm),P("AI PROTOTYPING<br/>HACKATHON","TitleX"),P("BEGINNER MANUAL  |  INTERNAL HACKATHON 2026","SubX"),Spacer(1,12*mm),P("From real-life pain point to a safe, measurable prototype.","SubX"),Spacer(1,28*mm),P("BUILD BOLD. PROVE THE VALUE. SHIP SOMETHING REAL.","CallX")]]],colWidths=[170*mm],rowHeights=[245*mm])
cover.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,-1),NAVY),("VALIGN",(0,0),(-1,-1),"TOP"),("LEFTPADDING",(0,0),(-1,-1),16*mm),("RIGHTPADDING",(0,0),(-1,-1),16*mm),("BOX",(0,0),(-1,-1),2,ORANGE)]))
S += [cover,PageBreak()]

S += page_title("Start here","How to use this manual","You do not need to be a data scientist. Start with a real work problem, choose the smallest toolset that can demonstrate value, and keep a person in control.")
S += [cards([("1. Frame","Name the problem, user, current process, and one measurable outcome."),("2. Build","Create the smallest end-to-end path that works with safe sample data."),("3. Prove","Test quality, calculate value and cost, document risks, then demo.")]),Spacer(1,8)]
S += [P("Choose your route","H2X"),matrix(["If your idea mainly...","Start with","Typical output"],[
    ["moves approvals, alerts, files, or forms","Power Apps + Power Automate","Form, workflow, Teams/email alert"],
    ["shows trends, exceptions, or KPIs","Excel/CSV + Power BI","Dashboard with filters and insights"],
    ["predicts, classifies, clusters, or detects anomalies","Colab/Kaggle + Python","Notebook, model result, simple chart"],
    ["answers questions over approved documents","Approved AI assistant or RAG prototype","Cited Q&A experience with guardrails"],
],[58*mm,55*mm,56*mm]),Spacer(1,8),box("Golden rule","Use the least sensitive data and the simplest architecture that can prove the idea. A small working prototype is stronger than a large diagram that does not run.",ORANGE),PageBreak()]

S += page_title("Hackathon finish line","What a strong submission contains","The intro deck asks for both a business layer and a technical layer. Your demo should connect them.")
S += [cards([("Business layer","Problem statement<br/>Target user<br/>Business value proposition"),("Technical layer","Data<br/>Model or method<br/>Workflow and architecture<br/>Evaluation and safety"),("Evidence","Working prototype<br/>Impact estimate<br/>Cost vs benefit<br/>Pilot next step")]),Spacer(1,8)]
S += bullets(["State the problem and user in one sentence.","Show the current process and its gap.","Name the dataset or documents used.","Explain the AI method or workflow in plain language.","Demonstrate a working path, including a failure or edge case.","Quantify time saved, cost avoided, quality improved, or turnaround reduced.","Flag privacy, legal, compliance, and policy considerations early.","End with a realistic pilot plan."])
S += [Spacer(1,6),box("Prototype, not production","A hackathon prototype may use sample data and manual steps behind the scenes. Label those limitations honestly; do not present them as production-ready automation.",CYAN),PageBreak()]

S += page_title("Step 1","Frame the problem before opening a tool")
S += [matrix(["Question","Good answer pattern","Weak answer"],[
    ["Problem","When [user] does [task], [pain] causes [measurable consequence].","We want an AI chatbot."],
    ["User","The person who performs, approves, or receives the work.","Everyone."],
    ["Baseline","Today it takes X minutes, Y handoffs, or has Z% rework.","It is slow."],
    ["Target","Reduce cycle time from X to Y while maintaining quality threshold Q.","Make it better."],
    ["Boundary","The prototype recommends; a named role approves before action.","The AI decides."],
],[30*mm,92*mm,47*mm]),Spacer(1,8),P("Copy-and-fill problem statement","H2X"),P("For <b>[target user]</b>, the current <b>[process]</b> requires <b>[time/effort]</b> and often causes <b>[error/delay]</b>. We will prototype <b>[assistant/workflow/dashboard/model]</b> that uses <b>[safe data]</b> to <b>[action]</b>. Success means <b>[metric and target]</b>, with <b>[human role]</b> approving <b>[high-impact step]</b>.","BodyX"),PageBreak()]

S += page_title("Step 2","Pick the smallest useful tool stack")
S += [matrix(["Tool","Use it for","Beginner first move","Watch out for"],[
    ["Microsoft Copilot / approved chat","Drafting, summarizing, ideation, structured extraction","Ask for a table, checklist, or options; verify every claim","Do not paste restricted data; outputs can be wrong"],
    ["Excel","Small datasets, calculations, quick charts, test cases","Create a clean table with one header row","Mixed units, hidden blanks, personal data"],
    ["Power Apps","Simple user-facing forms and canvas apps","Create a canvas app from a safe list/table","Environment, connector, and sharing permissions"],
    ["Power Automate","Triggers, approvals, notifications, file movement","Build one trigger -> one action -> one confirmation","Loops, duplicate runs, connector permissions"],
    ["Power BI","Interactive dashboards and KPI storytelling","Import a clean CSV; build three visuals and one slicer","Misleading scales and unclear measures"],
    ["Google Colab","Browser-based Python notebooks","Upload a safe CSV; inspect with pandas","Session resets and public-cloud data restrictions"],
    ["Kaggle","Public datasets and hosted notebooks","Read the Data Card and license before use","Quality, license, and hidden leakage"],
    ["GitHub","Versioning and team collaboration","Use a private approved repository and clear README","Never commit secrets, tokens, or restricted data"],
],[27*mm,48*mm,53*mm,41*mm]),PageBreak()]

S += page_title("AI assistants","Prompting that produces usable work","A prompt is a work brief. Give the model a role, goal, context, constraints, and output format - then review the result.")
S += [P("The CLEAR pattern","H2X"),matrix(["Part","What to provide","Example"],[
    ["C - Context","Audience, process, data meaning","This is a weekly maintenance exception report for site supervisors."],
    ["L - Limit","Scope, policy, length, forbidden actions","Use only the supplied rows. Do not infer missing causes."],
    ["E - Expected output","Format and fields","Return a 5-column table: asset, issue, severity, evidence, next step."],
    ["A - Ask","The exact task","Group repeated issues and prioritize the top five."],
    ["R - Review","Checks and uncertainty","Cite row IDs; mark uncertain items; list assumptions."],
],[22*mm,59*mm,88*mm]),Spacer(1,7),P("Copyable prompt","H2X"),P("You are helping <b>[role]</b>. Goal: <b>[task]</b>. Context: <b>[facts]</b>. Use only <b>[approved inputs]</b>. Constraints: <b>[policy, length, tone]</b>. Return <b>[format]</b>. For every recommendation, show <b>[evidence]</b>. If information is missing, say so. Before finalizing, check <b>[quality tests]</b>.","BodyX"),Spacer(1,5),box("Never trust fluent wording as proof","Verify names, numbers, calculations, citations, policy statements, and technical claims against an authoritative source or test case.",ORANGE),PageBreak()]

S += page_title("Data safety gate","Decide what may enter each tool","Tool access does not automatically mean data is approved for that tool. Follow NESR policy and ask the data owner or security/legal contact when unsure.")
S += [matrix(["Data type","Examples","Prototype action"],[
    ["Public","Open government data, public Kaggle dataset with suitable license","Document source, license, version, and limitations."],
    ["Synthetic","Invented records that mimic structure but not real people/assets","Preferred for demos; state how it was generated."],
    ["Internal","Company process data without highly sensitive fields","Use only approved corporate tools and least-privilege access."],
    ["Restricted / personal / confidential","Employee identifiers, customer data, credentials, contracts, sensitive operations","Do not use without explicit approval and controls. Create a synthetic substitute."],
],[35*mm,66*mm,68*mm]),Spacer(1,8),P("Before importing or pasting data","H2X")]
S += bullets(["Who owns the data, and have they approved this use?","Does it include names, IDs, contact details, location, contracts, or operationally sensitive fields?","Is the tool approved for that classification and region?","Can you remove columns, aggregate rows, or use synthetic data?","How will files, prompts, logs, and outputs be deleted after the event?","Who can access the prototype and shared links?"])
S += [PageBreak()]

S += page_title("Low-code route","Build a simple workflow with Power Automate","Best for repetitive handoffs: a form arrives, a rule runs, someone approves, and a notification or record is created.")
S += [P("Your first cloud flow","H2X")]
S += bullets(["Write the flow on paper: <b>trigger -> checks -> action -> confirmation</b>.","Open Power Automate in the correct corporate environment.","Choose an automated, instant, or scheduled cloud flow.","Start with one safe trigger, such as a new form response or approved list item.","Add one condition. Name branches in plain language: Approved / Needs review.","Add one action, such as create an item or send a Teams/email notification.","Test with three records: normal, missing value, and boundary case.","Open run history and capture evidence of success and failure handling."])
S += [Spacer(1,6),matrix(["Design question","Beginner answer"],[
    ["What starts it?","A named event, not 'when something happens.'"],
    ["Can it run twice?","Use an ID/status field and prevent duplicate processing."],
    ["What if a connector fails?","Notify an owner and preserve the source record."],
    ["Where is human approval?","Before external messages, payments, access changes, or high-impact decisions."],
],[52*mm,117*mm]),Spacer(1,6),box("Licensing and permissions","Connectors, AI features, environments, and sharing may require admin enablement or specific licenses. Confirm access early; keep a fallback demo video or mocked step.",CYAN),PageBreak()]

S += page_title("Low-code route","Build a front end with Power Apps","Use Power Apps when a user needs to enter, review, filter, or approve information through a simple interface.")
S += [P("Minimum viable canvas app","H2X")]
S += bullets(["Sketch three screens: <b>Home/List</b>, <b>Details</b>, and <b>Submit/Review</b>.","Connect to a safe, approved source such as SharePoint, Dataverse, or a small prototype table.","Use clear field labels and mark required fields.","Validate input before submission; show a useful error message.","Add a status field so users know Draft, Submitted, Approved, or Returned.","Use role-based visibility only as a usability aid; secure the underlying data source too.","Test on the device size you will demo.","Share only with the intended test group."])
S += [Spacer(1,7),cards([("Good prototype","One job, few screens, obvious next action, safe sample data."),("Avoid","A mini enterprise system with ten screens and no tested end-to-end path."),("Demo proof","Submit one record, show where it is stored, then show the downstream flow.")]),PageBreak()]

S += page_title("Analytics route","Turn a clean table into a Power BI story","A dashboard should help a user notice, decide, and act - not merely display many charts.")
S += [P("First report recipe","H2X")]
S += bullets(["Define one decision: What should the viewer do differently after seeing this?","Create a tidy table: one row per event/entity, one header row, consistent dates and units.","Import the file and inspect data types in Power Query.","Create three measures: volume, outcome, and change versus baseline.","Build three visuals: headline KPI, trend, and breakdown.","Add one slicer that matters to the decision, such as site, category, or month.","Use titles that state the question: 'Where are delays increasing?'","Check filters, blank values, totals, and axis scales against the source."])
S += [Spacer(1,6),P("Simple measures to prepare","H2X"),matrix(["Measure","Formula idea"],[
    ["Cycle time saved","(baseline minutes - new minutes) x monthly cases"],
    ["Error reduction","baseline error rate - prototype error rate"],
    ["Cost avoided","hours saved x loaded hourly cost"],
    ["Coverage","records successfully processed / eligible records"],
],[55*mm,114*mm]),PageBreak()]

S += page_title("Notebook route","Start safely in Google Colab","A notebook mixes runnable code, results, charts, and explanation. It is ideal for a transparent data-science prototype.")
S += [P("Five-cell starter workflow","H2X"),code("# 1. Import libraries\nimport pandas as pd\nimport matplotlib.pyplot as plt\n\n# 2. Load a SAFE local CSV\nfrom google.colab import files\nuploaded = files.upload()\ndf = pd.read_csv(next(iter(uploaded)))\n\n# 3. Inspect before modeling\ndisplay(df.head())\nprint(df.shape)\nprint(df.dtypes)\nprint(df.isna().sum())\n\n# 4. Summarize\ndisplay(df.describe(include='all').T)\n\n# 5. Save a result\ndf.to_csv('prototype_output.csv', index=False)"),Spacer(1,7)]
S += bullets(["Rename cells with Markdown headings so teammates can follow the story.","Run from top to bottom before the demo; hidden state causes surprises.","Pin dependency versions only if you install extra packages.","Download a copy of the notebook and outputs; hosted sessions can reset.","Do not put secrets directly in code cells or shared notebooks."])
S += [PageBreak()]

S += page_title("Notebook route","Find and assess a Kaggle dataset","The fastest dataset is not always the safest or most useful. Read its documentation before downloading.")
S += [P("Dataset fitness checklist","H2X")]
S += bullets(["The license permits your intended use.","The Data Card explains columns, units, source, collection period, and known limitations.","The target or outcome is actually present and meaningful.","The dataset is recent enough for the question.","Missingness and class imbalance are manageable.","Rows are not duplicated across training and testing.","It does not contain personal or sensitive data you do not need.","You record the dataset URL, owner, version, and access date."])
S += [Spacer(1,6),P("Optional download with kagglehub","H2X"),code("# In Colab or another Python environment\n!pip -q install kagglehub\nimport kagglehub\n\n# Replace with the dataset handle from its URL\npath = kagglehub.dataset_download('owner/dataset-name')\nprint(path)"),Spacer(1,6),box("Prefer attachment inside Kaggle notebooks","Kaggle's official kagglehub library can attach resources directly in Kaggle notebooks. Authentication may be required elsewhere. Never expose an API token in a shared notebook or repository.",CYAN),PageBreak()]

S += page_title("Notebook route","Clean and understand data with pandas")
S += [P("A repeatable inspection block","H2X"),code("# Standardize column names\ndf.columns = (df.columns.str.strip().str.lower()\n              .str.replace(' ', '_', regex=False))\n\n# Remove exact duplicates\ndf = df.drop_duplicates()\n\n# Parse a date and numeric field\ndf['event_date'] = pd.to_datetime(df['event_date'], errors='coerce')\ndf['value'] = pd.to_numeric(df['value'], errors='coerce')\n\n# Review quality\nquality = pd.DataFrame({\n    'dtype': df.dtypes.astype(str),\n    'missing': df.isna().sum(),\n    'unique': df.nunique()\n})\ndisplay(quality)"),Spacer(1,8),matrix(["Symptom","Likely cause","What to do"],[
    ["Numbers stored as text","Currency signs, commas, mixed labels","Clean deliberately; count values that become missing."],
    ["Very high accuracy","Target leakage or duplicate entities","Audit features; split by time/entity where appropriate."],
    ["Model ignores a group","Imbalance or missing coverage","Report group counts and per-group performance."],
    ["Beautiful trend, wrong conclusion","Seasonality or changing denominator","Compare like periods and expose the denominator."],
],[38*mm,58*mm,73*mm]),PageBreak()]

S += page_title("AI/model route","Build a baseline before a clever model","A baseline tells judges whether AI adds value. Use a simple rule or common model first, then compare fairly.")
S += [matrix(["Task","Simple baseline","Useful metrics"],[
    ["Classification","Most-common class or logistic regression","Precision, recall, F1, confusion matrix"],
    ["Regression","Mean/median or linear regression","MAE, RMSE; compare with business tolerance"],
    ["Forecasting","Last value or seasonal average","MAE/MAPE with caveats for near-zero values"],
    ["Anomaly detection","Threshold or interquartile range","True alerts, missed events, false alarms"],
    ["Document Q&A","Keyword search or curated FAQ","Answer correctness, citation correctness, abstention rate"],
],[34*mm,65*mm,70*mm]),Spacer(1,8),P("Evaluation discipline","H2X")]
S += bullets(["Separate training/tuning data from final test data.","Split by time or entity when random splitting would leak future or repeated information.","Report the baseline beside the prototype result.","Show the confusion matrix or several real examples, not only one score.","Define the cost of false positives and false negatives with the business owner.","Test missing inputs, unusual values, and groups underrepresented in the data.","Record model, parameters, dataset version, and random seed where applicable."])
S += [PageBreak()]

S += page_title("Document Q&A","Know when you need RAG","Retrieval-augmented generation (RAG) first finds relevant approved passages, then asks a language model to answer from those passages.")
S += [cards([("1. Retrieve","Search indexed document chunks using keywords or embeddings."),("2. Generate","Give the selected passages and question to the model."),("3. Verify","Show citations, test unsupported questions, and allow abstention.")]),Spacer(1,8),P("Use RAG when","H2X")]
S += bullets(["Answers must rely on a changing or organization-specific document collection.","Users need to see where an answer came from.","The documents are approved for the selected platform and access controls."])
S += [P("Do not use RAG as a shortcut when","H2X")]
S += bullets(["A simple search page or FAQ is enough.","Documents have conflicting owners, versions, or classifications.","The system cannot enforce the user's document permissions."])
S += [Spacer(1,5),matrix(["Test","Pass condition"],[
    ["Answerable question","Correct answer with the correct supporting passage."],
    ["Unanswerable question","Says it cannot find support; does not invent."],
    ["Conflicting documents","Surfaces the conflict and dates/sources."],
    ["Permission boundary","A user cannot retrieve content they cannot normally access."],
],[62*mm,107*mm]),PageBreak()]

S += page_title("Architecture","Draw the end-to-end path","Use boxes and arrows that a nontechnical judge can follow. Every box should have an owner, input, output, and failure behavior.")
S += [P("USER / TRIGGER  ->  INPUT  ->  VALIDATE  ->  AI OR RULE  ->  HUMAN REVIEW  ->  ACTION  ->  LOG / KPI","CodeX"),Spacer(1,8),matrix(["Layer","Questions to answer"],[
    ["User","Who starts the process and who receives the result?"],
    ["Data","Where does it come from? What is its classification and retention?"],
    ["Logic / AI","What rule, model, prompt, or retrieval step is used?"],
    ["Integration","Which connectors, APIs, files, or services move information?"],
    ["Human control","Who approves, corrects, overrides, or stops the action?"],
    ["Monitoring","What is logged? Which quality, cost, and safety KPIs are watched?"],
    ["Failure","What happens when data is missing, a model is uncertain, or a service is down?"],
],[40*mm,129*mm]),Spacer(1,7),box("Label prototype shortcuts","If a teammate manually copies output between tools, show that honestly as a dashed 'manual for prototype' step and describe how a pilot would integrate it.",ORANGE),PageBreak()]

S += page_title("Impact","Quantify the value; do not just claim it")
S += [matrix(["Outcome","Simple estimate","Evidence to collect"],[
    ["Time saved","(before minutes - after minutes) x cases per month","Timed sample, workflow logs, user observation"],
    ["Cost avoided","hours saved x loaded hourly cost","Finance-approved assumption or clearly labeled estimate"],
    ["Quality improved","baseline defect rate - prototype defect rate","Blind review or held-out test cases"],
    ["Faster turnaround","baseline median duration - prototype median duration","Comparable cases and consistent start/end points"],
    ["Value created","total benefit - total recurring cost","Scenario range: conservative, expected, optimistic"],
],[36*mm,67*mm,66*mm]),Spacer(1,8),P("Worked example","H2X"),P("A review takes 18 minutes today and 11 minutes with the prototype. At 400 cases/month: <b>7 x 400 = 2,800 minutes = 46.7 hours saved/month.</b> If the loaded labor rate is AED 180/hour, estimated gross value is <b>AED 8,406/month</b>. If monthly compute, licensing, maintenance, and human review cost AED 2,700, estimated net value is <b>AED 5,706/month</b>. Show assumptions and sensitivity; do not present estimates as audited savings.","BodyX"),PageBreak()]

S += page_title("Cost","Prove that the technical solution is worth running")
S += [matrix(["Cost element","Include"],[
    ["AI / compute","Model usage, API calls, notebook/GPU time, hosting, storage"],
    ["Licensing","Premium connectors, Power Platform capacity, user licenses"],
    ["Human review","Time to check, approve, and correct AI output"],
    ["Build / integration","Developer or analyst time, connectors, testing"],
    ["Maintenance","Monitoring, retraining, prompt/document updates, support"],
    ["Risk controls","Security review, audit logging, access management"],
],[45*mm,124*mm]),Spacer(1,8),P("Use a range, not false precision","H2X")]
S += bullets(["Conservative case: lower adoption and benefit, higher cost.","Expected case: best defensible assumptions.","Optimistic case: higher adoption, but still plausible.","State which costs are one-time versus monthly.","Name who must validate pricing, labor rates, and licensing before a pilot."])
S += [PageBreak()]

S += page_title("Responsible AI","Build controls into the prototype")
S += [matrix(["Risk","Beginner control","Evidence in demo"],[
    ["Privacy / confidentiality","Minimize fields; synthetic data; approved platform; restricted sharing","Data inventory and classification note"],
    ["Hallucination / error","Ground in sources; validation rules; abstain when uncertain","Incorrect and unsupported test cases"],
    ["Bias / unfair impact","Check coverage and outcomes across relevant groups","Group counts and performance review"],
    ["Automation harm","Human approval before consequential action; easy override","Approval screen and audit trail"],
    ["Prompt injection / unsafe content","Treat external text as data, restrict tools/actions, validate output","Malicious or irrelevant input test"],
    ["Legal / policy mismatch","Identify applicable rules and obtain owner review","Open questions and required approvals"],
],[36*mm,76*mm,57*mm]),Spacer(1,8),P("Safety card to include in your submission","H2X"),P("<b>Intended use:</b> [what it supports]. <b>Not for:</b> [forbidden/high-risk uses]. <b>Data:</b> [source/classification]. <b>Known limitations:</b> [where it fails]. <b>Human control:</b> [who reviews]. <b>Monitoring:</b> [quality/cost/safety metrics]. <b>Escalation:</b> [who is contacted and when].","BodyX"),PageBreak()]

S += page_title("Testing","Use a small but deliberate test pack")
S += [matrix(["Test type","Example","Expected behavior"],[
    ["Happy path","Complete, normal input","Correct output and logged success"],
    ["Missing field","No date, category, or document","Helpful validation; no silent guessing"],
    ["Boundary","Zero, maximum, deadline, or threshold value","Correct rule at the exact edge"],
    ["Messy input","Typo, duplicate, unexpected format","Normalize, reject, or route for review"],
    ["Unsupported request","Question outside documents/scope","Abstain and direct user appropriately"],
    ["Adversarial","Instruction hidden in uploaded text","Ignore unsafe instruction; preserve control boundary"],
    ["Service failure","Connector/model unavailable","Safe fallback; owner notified; no lost record"],
],[35*mm,64*mm,70*mm]),Spacer(1,8),P("Test log columns","H2X"),P("Test ID | Input | Expected result | Actual result | Pass/Fail | Evidence link | Owner | Fix/retest date","CodeX"),Spacer(1,6),box("Freeze a demo version","After final testing, duplicate or tag the working version. Last-minute edits are a common cause of failed demos.",ORANGE),PageBreak()]

S += page_title("Demo","Tell a six-minute evidence story")
S += [matrix(["Time","What to show"],[
    ["0:00-0:45","Problem, user, current process, and baseline."],
    ["0:45-1:15","Architecture and data classification in one slide."],
    ["1:15-3:15","Live happy path from input to outcome."],
    ["3:15-4:00","One edge case, failure, or human approval control."],
    ["4:00-4:45","Evaluation results and limitations."],
    ["4:45-5:30","Impact math and cost vs benefit."],
    ["5:30-6:00","Pilot plan, owner, approvals, and next milestone."],
],[31*mm,138*mm]),Spacer(1,8),P("Demo resilience checklist","H2X")]
S += bullets(["Use a clean test account and approved sample data.","Preload slow pages but still explain the actual trigger.","Keep a 60-90 second backup recording.","Export key screenshots/results in case a service is unavailable.","Remove notifications, credentials, unrelated tabs, and sensitive history.","Assign one narrator, one operator, and one teammate to track time/questions."])
S += [PageBreak()]

S += page_title("Team plan","A practical 2-day build sequence")
S += [matrix(["Window","Outcome"],[
    ["Hour 0-1","Agree on user, problem, baseline, target metric, and data boundary."],
    ["Hour 1-2","Choose one route; sketch architecture and happy path."],
    ["Hour 2-5","Clean/create sample data; build the thinnest end-to-end prototype."],
    ["Hour 5-7","Add one useful feature only after the happy path works."],
    ["Hour 7-9","Test normal, missing, boundary, unsupported, and failure cases."],
    ["Hour 9-11","Measure quality; calculate impact and cost scenarios."],
    ["Hour 11-13","Document controls, limitations, and pilot requirements."],
    ["Hour 13-15","Build the pitch; rehearse with a timer and skeptical questions."],
    ["Final hour","Freeze version, verify links/access, save backup video and exports."],
],[34*mm,135*mm]),Spacer(1,8),cards([("Business lead","Problem, user, baseline, value, pitch."),("Builder","Prototype, architecture, runbook, backup."),("Data/test lead","Data quality, evaluation, risk tests, evidence.")]),PageBreak()]

S += page_title("Troubleshooting","When the prototype does not cooperate")
S += [matrix(["Problem","Fast diagnosis","Fallback"],[
    ["Cannot access a connector or AI feature","Check account, environment, license, admin policy","Mock that step and document pilot dependency"],
    ["Flow runs repeatedly","Inspect trigger condition and status/idempotency field","Disable flow; demo with a controlled instant trigger"],
    ["App user sees no data","Check source sharing and row permissions","Use a controlled demo account and safe sample source"],
    ["Notebook lost state","Restart and Run all; verify file paths/install cells","Keep downloaded notebook, data, and output copies"],
    ["Model score is suspiciously high","Audit leakage, duplicates, split method","Return to baseline and honest limitation"],
    ["AI answer changes each run","Constrain prompt, temperature if available, source context, output schema","Use fixed test examples and human review"],
    ["Live demo internet failure","Do not improvise with sensitive local files","Play backup video and show exported evidence"],
],[39*mm,71*mm,59*mm]),PageBreak()]

S += page_title("Submission templates","Copy these into your working document")
S += [P("One-page concept","H2X"),P("<b>Project title:</b> ____<br/><b>Target user:</b> ____<br/><b>Problem and current baseline:</b> ____<br/><b>Proposed prototype:</b> ____<br/><b>Data source and classification:</b> ____<br/><b>AI/model/workflow:</b> ____<br/><b>Success metric and target:</b> ____<br/><b>Human control:</b> ____<br/><b>Known limitations:</b> ____<br/><b>Pilot owner and next step:</b> ____","BodyX"),Spacer(1,7),P("Cost vs benefit","H2X"),P("Monthly cases: ____ | Minutes saved/case: ____ | Hours saved: ____ | Value/hour: ____ | Gross benefit: ____ | AI/compute: ____ | Licensing: ____ | Human review: ____ | Maintenance: ____ | Net value: ____","BodyX"),Spacer(1,7),P("Architecture inventory","H2X"),P("Component | Owner | Input | Output | Data class | Access | Failure behavior | Log/KPI","CodeX"),Spacer(1,7),P("Decision log","H2X"),P("Date | Decision | Options considered | Reason | Owner | Assumption to validate","CodeX"),PageBreak()]

S += page_title("Glossary","Plain-English AI and technical terms")
S += [matrix(["Term","Meaning"],[
    ["AI model","A learned system that maps inputs to predictions or generated outputs."],
    ["LLM","A large language model trained to predict and generate text-like sequences."],
    ["Prompt","Instructions and context sent to a generative AI model."],
    ["Hallucination","A plausible-sounding output that is unsupported or incorrect."],
    ["Token","A chunk of text processed by a language model; not always a full word."],
    ["Embedding","A numeric representation used to compare meaning or similarity."],
    ["RAG","Retrieval-augmented generation: retrieve sources, then answer from them."],
    ["Agent","A system that uses a model plus tools and control logic to take steps."],
    ["Feature","An input variable used by a model."],
    ["Inference","Running a trained model on new input."],
    ["API","A defined way for software systems to exchange requests and results."],
    ["Connector","A packaged integration between Power Platform and another service."],
    ["Baseline","The simple rule/model or current process used for comparison."],
    ["Precision / recall","How trustworthy positive alerts are / how many real positives were found."],
    ["Human in the loop","A person reviews or approves at a defined control point."],
],[38*mm,131*mm]),PageBreak()]

S += page_title("Final gate","Ten checks before you submit")
S += bullets(["1. The problem, target user, and current baseline are specific.","2. The prototype completes one end-to-end job.","3. Data source, classification, owner, and license/approval are recorded.","4. The method and architecture are understandable to a nontechnical judge.","5. Results are compared with a baseline on documented test cases.","6. Impact is quantified with visible assumptions.","7. AI/compute, human review, licensing, and maintenance costs are included.","8. Privacy, legal, compliance, bias, error, and misuse risks have controls.","9. Limitations and non-production shortcuts are stated honestly.","10. The demo, backup recording, links, and access have been tested."])
S += [Spacer(1,10),box("The standard","Build bold - but prove the value, show the controls, and ship something real enough to pilot.",ORANGE),Spacer(1,12),P("Source basis","H2X"),P("This manual was developed from the NESR AI Prototyping Hackathon 2026 introduction deck, the supplied AI learning-track material, and the Learn AI hackathon guide. Product interfaces and licensing can change; verify availability in the NESR tenant before the event.","SmallX"),PageBreak()]

S += page_title("Official learning links","Use these when you need the current interface or exact product steps")
links=[
    ("Microsoft Power Automate documentation","https://learn.microsoft.com/en-us/power-automate/"),
    ("Power Automate home and getting started","https://learn.microsoft.com/en-us/power-automate/getting-started"),
    ("Microsoft Power Apps training","https://learn.microsoft.com/en-us/training/powerplatform/power-apps"),
    ("Sign in to and choose a Power Apps environment","https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/sign-in-to-power-apps"),
    ("Microsoft Power BI training","https://learn.microsoft.com/en-us/training/powerplatform/power-bi"),
    ("Google Colab welcome notebook","https://colab.research.google.com/notebooks/intro.ipynb"),
    ("Kaggle official kagglehub library","https://github.com/Kaggle/kagglehub"),
    ("pandas getting started","https://pandas.pydata.org/docs/getting_started/index.html"),
    ("scikit-learn getting started","https://scikit-learn.org/stable/getting_started.html"),
    ("GitHub documentation","https://docs.github.com/"),
]
for name,url in links:
    S += [P(f'<link href="{url}" color="#176BFF"><b>{name}</b></link><br/><font color="#53647A">{url}</font>',"BodyX"),Spacer(1,3)]
S += [Spacer(1,7),P("Access note","H2X"),P("Some services, connectors, AI capabilities, or external sites may be unavailable or restricted by NESR policy, tenant settings, geography, or license. Use approved alternatives and confirm with the relevant administrator. This manual does not replace NESR security, privacy, legal, compliance, records, or AI-use policies.","SmallX")]

doc.build(S,onFirstPage=footer,onLaterPages=footer)
print(PDF)
