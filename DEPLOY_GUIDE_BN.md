# একদম বিনামূল্যে GitHub Pages-এ Website Publish

এই website-এর জন্য কোনো hosting fee, template fee বা subscription লাগবে না।

## পদ্ধতি ১: GitHub website ব্যবহার করে

1. `https://github.com/Faisal-A-Chowdhury`-এ sign in করুন।
2. **New repository** চাপুন।
3. Repository name দিন: `Faisal-A-Chowdhury.github.io`
4. Repository **Public** রাখুন।
5. **Create repository** চাপুন।
6. ZIP file-টি computer-এ unzip করুন।
7. নতুন repository-তে **uploading an existing file** নির্বাচন করুন।
8. Unzip করা folder-এর `index.html`, `assets`, `files`, `.nojekyll`, `robots.txt`, এবং `sitemap.xml` upload করুন।
9. Commit message লিখুন: `Launch academic portfolio`
10. **Commit changes** চাপুন।
11. Repository-এর **Settings > Pages** খুলুন।
12. **Source: Deploy from a branch** নির্বাচন করুন।
13. Branch হিসেবে `main` এবং folder হিসেবে `/ (root)` নির্বাচন করে **Save** চাপুন।
14. Deployment শেষ হলে website হবে: `https://faisal-a-chowdhury.github.io/`

## পদ্ধতি ২: Mac Terminal ব্যবহার করে

ZIP file unzip করে সেই folder-এ Terminal খুলে চালান:

```bash
git init
git branch -M main
git add .
git commit -m "Launch academic portfolio"
git remote add origin https://github.com/Faisal-A-Chowdhury/Faisal-A-Chowdhury.github.io.git
git push -u origin main
```

এরপর GitHub-এর **Settings > Pages** থেকে `main` এবং `/ (root)` নির্বাচন করুন।

## পরে তথ্য পরিবর্তন

- মূল লেখা: `index.html`
- design ও color: `assets/styles.css`
- interaction: `assets/app.js`
- profile photo: `assets/faisal-profile.png`
- CV: `files/Faisal_Ahmed_Chowdhury_CV.pdf`

নতুন CV দিলে একই filename রেখে পুরোনো PDF replace করলেই CV button আপডেট হয়ে যাবে।

## গুরুত্বপূর্ণ

- Website page-এ phone number দেখানো হয়নি।
- Supplied CV অপরিবর্তিত রাখা হয়েছে; সেই PDF-এর মধ্যে phone number আছে।
- Custom domain না কিনলেও website সম্পূর্ণভাবে কাজ করবে।
