# Medical Resources Page Update - January 2025

## Problem Identified
The `/med/resources/` page contained **INCORRECT INFORMATION** - it was showing adult-use cannabis store regulations (Title 28-B) instead of medical marijuana program requirements (Title 22 MRS Chapter 558-C).

## What Was Wrong

### Incorrect Citations (Before):
- `§504(4)` - Adult-use store age verification (21+)
- `§504(2)(B)` - Adult-use purchase limits
- `§508(3)(B)` - Adult-use on-premises rules  
- `§701(4)` - Adult-use health warnings
- `§602` - Adult-use testing requirements
- `§106` - Adult-use employee badges
- `§701` - Adult-use packaging/labeling

### Incorrect Content:
- "21+ entry" - Medical program has no age restriction for qualifying patients
- "2.5 oz total and 10 g concentrate sub-limit" - This is ADULT-USE limits
- "Age Verification Requirements" - Medical needs PATIENT CERTIFICATION verification
- "Employee ID Badge Requirements" - Not applicable to medical caregivers

---

## What's Now Correct

### Medical Program Requirements (Title 22 MRS Chapter 558-C)

#### 1. Patient Identification Verification
- **Requirement**: Valid patient certification + government-issued ID
- **Citation**: 22 MRS §2423-A (Authorized conduct for medical use)
- **Applies to**: Qualifying patients and designated caregivers

#### 2. Patient Possession Limits  
- **Usable cannabis**: 2.5 ounces (immediate possession)
- **Harvested cannabis**: 8 pounds (home storage)
- **Cultivation rights**: 6 mature plants, 12 immature plants, unlimited seedlings
- **Citation**: 22 MRS §2423-A(2)
- **Source**: [Maine Legislature Title 22 §2423-A](https://legislature.maine.gov/statutes/22/title22sec2423-A.html)

#### 3. Dispensary & Caregiver Facility Rules
- Authorized conduct for qualifying patients
- Patient rights and confidentiality protections
- **Citation**: 22 MRS §2423-A

#### 4. Medical Cannabis Health & Safety Warnings
- Pregnancy warnings and medication interactions
- Safe use guidelines specific to medical patients
- **Citation**: 22 MRS §2426

#### 5. Signs, Advertising & Marketing Compliance (NEW)
- Signage cannot be placed within **1,000 feet of schools** (unless municipality sets 500-1,000 ft)
- Prohibited: Marketing to minors, misleading/deceptive information
- **Citation**: 22 MRS §2428(6)(E)
- **Source**: [Title 28-B §702](https://legislature.maine.gov/statutes/28-B/title28-Bsec702.html) (applies to medical via §2428)

---

## Staff References Updated

### 1. Caregiver & Dispensary Registration (NEW)
- Registry identification card requirements
- Application process and renewal procedures
- Cultivation area limits and patient limits (5 patients max per caregiver)
- **Citation**: 22 MRS §2423-A, §2428

### 2. Cannabis Testing & Safety Standards
- Testing facility certification requirements
- Contaminant limits and pesticide screening
- **Citation**: 22 MRS §2428(7)

### 3. Packaging, Labeling & Child-Resistant Standards
- Required label information (THC/CBD content, warnings)
- Child-resistant packaging requirements
- Universal symbol usage
- **Citation**: 22 MRS §2428(9)

### 4. Qualifying Patient Rights & Confidentiality (NEW)
- Patient privacy protections
- Medical certification confidentiality
- Discrimination prohibitions
- **Citation**: 22 MRS §2423-A(3)

### 5. Cultivation Area & Plant Count Limits (NEW)
- **Caregiver limits**: Up to 5 qualifying patients per registered caregiver
- **Plant counts**: 6 mature, 12 immature, unlimited seedlings (per patient)
- **Harvest possession**: 8 pounds (per patient)
- Multiple cultivation areas allowed for caregivers
- **Citation**: 22 MRS §2423-A(2), §2428

---

## Key Differences: Medical vs. Adult-Use

| Aspect | Medical Program (Title 22) | Adult-Use (Title 28-B) |
|--------|---------------------------|------------------------|
| **Age requirement** | Qualifying patients (any age with certification) | 21+ only |
| **Immediate possession** | 2.5 oz usable cannabis | 2.5 oz cannabis |
| **Home possession** | **8 lbs harvested cannabis** | 2.5 oz total |
| **Cultivation rights** | **6 mature, 12 immature, unlimited seedlings** | Not allowed (unless home cultivation) |
| **Concentrate limits** | No separate sublimit | 10g concentrate sublimit |
| **ID requirement** | Patient certification + govt ID | Govt-issued photo ID (21+) |
| **Caregiver model** | Yes (5 patients max) | No |
| **Purchase location** | Registered dispensaries, caregivers | Licensed cannabis stores |

---

## Sources Verified (January 2025)

### Primary Sources:
1. **Title 22 MRS §2423-A** - Authorized conduct for medical use of cannabis  
   https://legislature.maine.gov/statutes/22/title22sec2423-A.html

2. **Title 22 MRS Chapter 558-C** - Maine Medical Use of Cannabis Act  
   https://legislature.maine.gov/statutes/22/title22ch558-Csec0.html

3. **Maine Office of Cannabis Policy - Medical Use Program**  
   https://www.maine.gov/dafs/ocp/medical-use

4. **OCP FAQs** - Patient possession limits and cultivation rights  
   https://www.maine.gov/dafs/ocp/resources/faq

5. **OCP Guidance Documents**  
   https://www.maine.gov/dafs/ocp/resources/guidance-documents

### Verification Method:
- Web search of Maine OCP official resources (January 2025)
- Direct statute review via Maine Legislature website
- Cross-referenced with OCP FAQ on possession limits
- Confirmed 2.5 oz usable + 8 lbs harvested cannabis limits
- Verified cultivation rights (6 mature, 12 immature, unlimited seedlings)
- Confirmed caregiver limit (5 patients maximum)

---

## Implementation Details

### Files Modified:
- `/med/resources/index.html` - Complete rebuild of signage catalog

### Changes Made:
- Replaced all adult-use statute citations (Title 28-B) with medical program citations (Title 22)
- Updated all 4 required signage descriptions with accurate medical program requirements
- Added 5th signage item for advertising compliance (1,000 ft school distance rule)
- Replaced 3 staff references with 5 medically-relevant references
- Added "Patient Rights & Confidentiality" reference
- Added "Cultivation Limits" reference with caregiver/patient ratios
- Added comprehensive legal disclaimer section with official source links
- Updated page title and meta description to reflect medical program
- Added callout box with key medical program facts and citations

### Page Structure:
```
Medical Program Required Signage (5 items):
├── Patient Identification Verification (22 MRS §2423-A)
├── Patient Possession Limits (22 MRS §2423-A(2))
├── Dispensary & Caregiver Facility Rules (22 MRS §2423-A)
├── Medical Cannabis Health & Safety Warnings (22 MRS §2426)
└── Advertising Compliance (22 MRS §2428(6)(E))

Staff Reference Materials (5 items):
├── Caregiver & Dispensary Registration (§2423-A, §2428)
├── Cannabis Testing & Safety Standards (§2428(7))
├── Packaging, Labeling & Child-Resistant (§2428(9))
├── Patient Rights & Confidentiality (§2423-A(3))
└── Cultivation Limits (§2423-A(2), §2428)

Legal Disclaimers:
├── Possession limits summary
├── Cultivation rights summary
├── Caregiver limits
├── Official source links (OCP, Legislature)
└── Last verified date: January 2025
```

---

## Legal Disclaimer

**This resource is provided for informational purposes only and does not constitute legal advice.** Always consult current statutes and the Maine Office of Cannabis Policy for official guidance.

For official information, visit:
- **Maine OCP Medical Use Program**: https://www.maine.gov/dafs/ocp/medical-use
- **Title 22 MRS Chapter 558-C**: https://legislature.maine.gov/statutes/22/title22ch558-Csec0.html

---

*Document prepared: January 2025*  
*Statute verification: 22 MRS §§2423-A, 2426, 2428*  
*Last page update: Commit 6302cb3*
