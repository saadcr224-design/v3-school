const icons={home:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',book:'<path d="M12 5c-3-2-6-2-9-1v15c3-1 6-1 9 1 3-2 6-2 9-1V4c-3-1-6-1-9 1v15"/>',code:'<path d="m8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18"/>',chat:'<path d="M21 11a8 8 0 0 1-8 8H7l-5 3 2-6a8 8 0 1 1 17-5Z"/><path d="M8 10h8m-8 4h5"/>',bookmark:'<path d="M6 3h12v19l-6-4-6 4Z"/>',chart:'<path d="M4 20h17M7 16v-5m5 5V4m5 12V8"/>',arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>',search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',check:'<path d="m5 12 4 4L19 6"/>',bolt:'<path d="m13 2-9 12h7l-1 8 10-13h-7Z"/>',globe:'<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',layers:'<path d="m12 3 10 5-10 5L2 8Zm-9 10 9 5 9-5M3 18l9 5 9-5"/>',play:'<path d="m8 4 13 8-13 8Z"/>',spark:'<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z"/>',calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6m10-6v6M3 11h18"/>',menu:'<path d="M3 6h18M3 12h18M3 18h18"/>',back:'<path d="M20 12H4m6-6-6 6 6 6"/>',send:'<path d="m3 3 19 9-19 9 4-9Zm4 9h15"/>',download:'<path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4"/>'};
const icon=n=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[n]||icons.book}</svg>`;
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let lessons=[],route='home',filter='All',query='',current=1,lang='both',chat=[],compiler=null,running=false;
let state={name:'Learner',done:[],saved:[],drafts:{},visits:[],last:1,runs:0};
try{const saved=JSON.parse(localStorage.getItem('safar-v1'));if(saved&&Array.isArray(saved.done)&&Array.isArray(saved.saved))state={...state,...saved};}catch{}
const exercises=[
  {
    "id": 1,
    "title": "Your first output",
    "topic": "Output",
    "level": "Beginner",
    "prompt": "Print exactly: Hello, V3school! No input is needed.",
    "urdu": "بالکل Hello, V3school! دکھائیں۔ ان پٹ کی ضرورت نہیں۔",
    "hint": "Use std::cout and a quoted string. Remember the semicolon.",
    "solution": "#include <iostream>\n\nint main() {\n    std::cout << \"Hello, V3school!\";\n}\n",
    "starter": "#include <iostream>\n\nint main() {\n    // Write your solution here.\n    return 0;\n}\n",
    "tests": [
      {
        "input": "",
        "expected": "Hello, V3school!"
      }
    ]
  },
  {
    "id": 2,
    "title": "Add two numbers",
    "topic": "Input & arithmetic",
    "level": "Beginner",
    "prompt": "Read two integers a and b (−1000 to 1000). Print their sum only.",
    "urdu": "دو اعداد پڑھیں اور صرف ان کا مجموعہ دکھائیں۔",
    "hint": "Read both numbers using std::cin >> a >> b. Print a + b.",
    "solution": "#include <iostream>\n\nint main() {\n    int a{}, b{};\n    std::cin >> a >> b;\n    std::cout << a + b;\n}\n",
    "starter": "#include <iostream>\n\nint main() {\n    // Write your solution here.\n    return 0;\n}\n",
    "tests": [
      {
        "input": "3 4",
        "expected": "7"
      },
      {
        "input": "-5 2",
        "expected": "-3"
      },
      {
        "input": "0 0",
        "expected": "0"
      }
    ]
  },
  {
    "id": 3,
    "title": "Even or odd",
    "topic": "Conditions",
    "level": "Beginner",
    "prompt": "Read an integer n (−1000 to 1000). Print Even when n is divisible by 2; otherwise print Odd.",
    "urdu": "عدد پڑھیں؛ جفت پر Even ورنہ Odd دکھائیں۔",
    "hint": "The remainder n % 2 is zero for an even integer.",
    "solution": "#include <iostream>\n\nint main() {\n    int n{};\n    std::cin >> n;\n    std::cout << (n % 2 == 0 ? \"Even\" : \"Odd\");\n}\n",
    "starter": "#include <iostream>\n\nint main() {\n    // Write your solution here.\n    return 0;\n}\n",
    "tests": [
      {
        "input": "8",
        "expected": "Even"
      },
      {
        "input": "7",
        "expected": "Odd"
      },
      {
        "input": "-4",
        "expected": "Even"
      }
    ]
  },
  {
    "id": 4,
    "title": "Largest of three",
    "topic": "Conditions",
    "level": "Beginner",
    "prompt": "Read three integers. Print the largest value, including when two or more values are equal. Inputs are between −1000 and 1000.",
    "urdu": "تین اعداد میں سب سے بڑا دکھائیں، برابر قدریں بھی درست سنبھالیں۔",
    "hint": "Start with the first value as the largest, then compare the other two.",
    "solution": "#include <iostream>\n\nint main() {\n    int a{},b{},c{};\n    std::cin >> a >> b >> c;\n    int largest=a;\n    if(b>largest)largest=b;\n    if(c>largest)largest=c;\n    std::cout << largest;\n}\n",
    "starter": "#include <iostream>\n\nint main() {\n    // Write your solution here.\n    return 0;\n}\n",
    "tests": [
      {
        "input": "4 9 2",
        "expected": "9"
      },
      {
        "input": "-3 -8 -1",
        "expected": "-1"
      },
      {
        "input": "7 7 2",
        "expected": "7"
      }
    ]
  },
  {
    "id": 5,
    "title": "Sum from 1 to n",
    "topic": "Loops",
    "level": "Beginner",
    "prompt": "Read n between 0 and 1000. Use a loop to calculate and print 1 + 2 + … + n. For n = 0 print 0.",
    "urdu": "لوپ سے ایک سے n تک جمع کریں۔ صفر پر صفر دیں۔",
    "hint": "Initialize sum to zero. Add each i from 1 through n.",
    "solution": "#include <iostream>\n\nint main() {\n    int n{},sum{};\n    std::cin >> n;\n    for(int i=1;i<=n;++i)sum+=i;\n    std::cout << sum;\n}\n",
    "starter": "#include <iostream>\n\nint main() {\n    // Write your solution here.\n    return 0;\n}\n",
    "tests": [
      {
        "input": "10",
        "expected": "55"
      },
      {
        "input": "1",
        "expected": "1"
      },
      {
        "input": "0",
        "expected": "0"
      }
    ]
  },
  {
    "id": 6,
    "title": "Factorial",
    "topic": "Functions & loops",
    "level": "Beginner",
    "prompt": "Read n between 0 and 12. Print n factorial using a function. Remember 0! = 1.",
    "urdu": "فنکشن سے n کا factorial دیں؛ صفر کا جواب ایک ہے۔",
    "hint": "Start the product at 1, multiply from 2 to n, and return it from a function.",
    "solution": "#include <iostream>\n\nlong long factorial(int n) {\n    long long result=1;\n    for(int i=2;i<=n;++i)result*=i;\n    return result;\n}\n\nint main() {\n    int n{};\n    std::cin >> n;\n    std::cout << factorial(n);\n}\n",
    "starter": "#include <iostream>\n\nint main() {\n    // Write your solution here.\n    return 0;\n}\n",
    "tests": [
      {
        "input": "5",
        "expected": "120"
      },
      {
        "input": "0",
        "expected": "1"
      },
      {
        "input": "12",
        "expected": "479001600"
      }
    ]
  },
  {
    "id": 7,
    "title": "Sum a sequence",
    "topic": "Arrays & vectors",
    "level": "Beginner",
    "prompt": "Read n (0 to 100), then n integers (−1000 to 1000). Print the sum of the sequence.",
    "urdu": "پہلے تعداد، پھر اتنے اعداد پڑھ کر جمع دکھائیں۔",
    "hint": "Read values into a vector or accumulate each number as you read it.",
    "solution": "#include <iostream>\n\nint main() {\n    int n{},sum{};\n    std::cin >> n;\n    for(int i=0;i<n;++i){int x{};std::cin>>x;sum+=x;}\n    std::cout << sum;\n}\n",
    "starter": "#include <iostream>\n\nint main() {\n    // Write your solution here.\n    return 0;\n}\n",
    "tests": [
      {
        "input": "4\n1 2 3 4",
        "expected": "10"
      },
      {
        "input": "3\n-2 5 -1",
        "expected": "2"
      },
      {
        "input": "0",
        "expected": "0"
      }
    ]
  },
  {
    "id": 8,
    "title": "Reverse a word",
    "topic": "Strings",
    "level": "Beginner",
    "prompt": "Read one word of 1 to 100 ASCII letters. Print its characters in reverse order.",
    "urdu": "ایک لفظ پڑھیں اور اس کے حروف الٹی ترتیب میں دکھائیں۔",
    "hint": "std::reverse works with begin() and end(); alternatively traverse from the last character.",
    "solution": "#include <iostream>\n#include <string>\n#include <algorithm>\n\nint main() {\n    std::string word;\n    std::cin >> word;\n    std::reverse(word.begin(),word.end());\n    std::cout << word;\n}\n",
    "starter": "#include <iostream>\n#include <string>\n#include <algorithm>\n\nint main() {\n    // Write your solution here.\n    return 0;\n}\n",
    "tests": [
      {
        "input": "hello",
        "expected": "olleh"
      },
      {
        "input": "a",
        "expected": "a"
      },
      {
        "input": "level",
        "expected": "level"
      }
    ]
  },
  {
    "id": 9,
    "title": "Count vowels",
    "topic": "Strings & loops",
    "level": "Intermediate",
    "prompt": "Read one word of ASCII letters. Count a, e, i, o, u, treating uppercase letters as vowels too. Print the count.",
    "urdu": "لفظ میں چھوٹے اور بڑے حروف والے vowels گنیں۔",
    "hint": "Convert safely with std::tolower(static_cast<unsigned char>(c)), then compare with the five vowels.",
    "solution": "#include <iostream>\n#include <string>\n#include <cctype>\n\nint main() {\n    std::string word;\n    std::cin >> word;\n    int count=0;\n    for(unsigned char c:word){char x=static_cast<char>(std::tolower(c));if(x=='a'||x=='e'||x=='i'||x=='o'||x=='u')++count;}\n    std::cout << count;\n}\n",
    "starter": "#include <iostream>\n#include <string>\n#include <cctype>\n\nint main() {\n    // Write your solution here.\n    return 0;\n}\n",
    "tests": [
      {
        "input": "Education",
        "expected": "5"
      },
      {
        "input": "sky",
        "expected": "0"
      },
      {
        "input": "AEIOU",
        "expected": "5"
      }
    ]
  },
  {
    "id": 10,
    "title": "Sort numbers",
    "topic": "STL algorithms",
    "level": "Intermediate",
    "prompt": "Read n (0 to 100), then n integers. Print them in ascending order separated by spaces. Extra surrounding whitespace is ignored.",
    "urdu": "اعداد چھوٹے سے بڑے ترتیب میں، خالی جگہ سے الگ دکھائیں۔",
    "hint": "Use std::vector<int> and std::sort. Include <vector> and <algorithm>.",
    "solution": "#include <iostream>\n#include <vector>\n#include <algorithm>\n\nint main() {\n    int n{};\n    std::cin >> n;\n    std::vector<int> v(n);\n    for(int& x:v)std::cin >> x;\n    std::sort(v.begin(),v.end());\n    for(int x:v)std::cout << x << \" \";\n}\n",
    "starter": "#include <iostream>\n#include <vector>\n#include <algorithm>\n\nint main() {\n    // Write your solution here.\n    return 0;\n}\n",
    "tests": [
      {
        "input": "5\n3 1 4 1 2",
        "expected": "1 1 2 3 4"
      },
      {
        "input": "3\n-1 -3 0",
        "expected": "-3 -1 0"
      },
      {
        "input": "0",
        "expected": ""
      }
    ]
  },
  {
    "id": 11,
    "title": "Count unique values",
    "topic": "Sets",
    "level": "Intermediate",
    "prompt": "Read n (0 to 100), then n integers. Print the number of distinct values.",
    "urdu": "اعداد میں مختلف قدروں کی تعداد دکھائیں۔",
    "hint": "Insert each value into std::set<int>; its size counts unique elements.",
    "solution": "#include <iostream>\n#include <set>\n\nint main() {\n    int n{};std::cin>>n;\n    std::set<int> values;\n    for(int i=0;i<n;++i){int x{};std::cin>>x;values.insert(x);}\n    std::cout << values.size();\n}\n",
    "starter": "#include <iostream>\n#include <set>\n\nint main() {\n    // Write your solution here.\n    return 0;\n}\n",
    "tests": [
      {
        "input": "5\n1 2 1 3 2",
        "expected": "3"
      },
      {
        "input": "4\n7 7 7 7",
        "expected": "1"
      },
      {
        "input": "0",
        "expected": "0"
      }
    ]
  },
  {
    "id": 12,
    "title": "Rectangle class",
    "topic": "Classes & objects",
    "level": "Intermediate",
    "prompt": "Define a Rectangle class with width, height, and an area() method. Read two integers (0 to 1000), create an object, and print its area.",
    "urdu": "Rectangle کلاس اور area فنکشن بنائیں؛ چوڑائی اور اونچائی سے رقبہ دیں۔",
    "hint": "Initialize width and height in a constructor. area() returns width * height.",
    "solution": "#include <iostream>\n\nclass Rectangle {\n    int width, height;\npublic:\n    Rectangle(int w,int h):width(w),height(h){}\n    int area() const {return width*height;}\n};\n\nint main() {\n    int w{},h{};std::cin>>w>>h;\n    Rectangle r{w,h};\n    std::cout << r.area();\n}\n",
    "starter": "#include <iostream>\n\nint main() {\n    // Write your solution here.\n    return 0;\n}\n",
    "tests": [
      {
        "input": "3 4",
        "expected": "12"
      },
      {
        "input": "0 8",
        "expected": "0"
      },
      {
        "input": "10 10",
        "expected": "100"
      }
    ]
  },
  {
    "id": 13,
    "title": "Swap by reference",
    "topic": "References",
    "level": "Intermediate",
    "prompt": "Define void swapValues(int&, int&). Read two integers, swap them through the function, and print the new order.",
    "urdu": "ریفرنس والے فنکشن سے دو اعداد کی جگہ بدلیں اور نئی ترتیب دکھائیں۔",
    "hint": "Use a temporary int to preserve the first value while assigning the second.",
    "solution": "#include <iostream>\n\nvoid swapValues(int& a,int& b){int temp=a;a=b;b=temp;}\n\nint main() {\n    int a{},b{};std::cin>>a>>b;\n    swapValues(a,b);\n    std::cout << a << \" \" << b;\n}\n",
    "starter": "#include <iostream>\n\nint main() {\n    // Write your solution here.\n    return 0;\n}\n",
    "tests": [
      {
        "input": "3 8",
        "expected": "8 3"
      },
      {
        "input": "-1 0",
        "expected": "0 -1"
      },
      {
        "input": "5 5",
        "expected": "5 5"
      }
    ]
  },
  {
    "id": 14,
    "title": "Safe division",
    "topic": "Exceptions",
    "level": "Intermediate",
    "prompt": "Read integers a and b (−1000 to 1000). A divide function should throw when b = 0. Print Error for that case; otherwise print the integer quotient.",
    "urdu": "صفر سے تقسیم پر ایکسپشن دیں اور Error چھاپیں؛ ورنہ integer جواب دیں۔",
    "hint": "Throw std::invalid_argument for zero and catch it around the function call.",
    "solution": "#include <iostream>\n#include <stdexcept>\n\nint divide(int a,int b){if(b==0)throw std::invalid_argument(\"zero\");return a/b;}\n\nint main() {\n    int a{},b{};std::cin>>a>>b;\n    try{std::cout << divide(a,b);}\n    catch(const std::invalid_argument&){std::cout << \"Error\";}\n}\n",
    "starter": "#include <iostream>\n#include <stdexcept>\n\nint main() {\n    // Write your solution here.\n    return 0;\n}\n",
    "tests": [
      {
        "input": "9 2",
        "expected": "4"
      },
      {
        "input": "5 0",
        "expected": "Error"
      },
      {
        "input": "-9 2",
        "expected": "-4"
      }
    ]
  },
  {
    "id": 15,
    "title": "Generic maximum",
    "topic": "Templates",
    "level": "Advanced",
    "prompt": "Write a function template that returns the greater of two values. Read two integers and print the result from your template.",
    "urdu": "ٹیمپلیٹ فنکشن سے دو قدروں میں بڑی قدر دیں۔",
    "hint": "Use template<class T> and return a > b ? a : b.",
    "solution": "#include <iostream>\n\ntemplate<class T>T maximum(T a,T b){return a>b?a:b;}\n\nint main() {\n    int a{},b{};std::cin>>a>>b;\n    std::cout << maximum(a,b);\n}\n",
    "starter": "#include <iostream>\n\nint main() {\n    // Write your solution here.\n    return 0;\n}\n",
    "tests": [
      {
        "input": "7 3",
        "expected": "7"
      },
      {
        "input": "-5 -2",
        "expected": "-2"
      },
      {
        "input": "4 4",
        "expected": "4"
      }
    ]
  },
  {
    "id": 16,
    "title": "Filter even numbers",
    "topic": "Modern C++ & lambdas",
    "level": "Advanced",
    "prompt": "Read n (0 to 100), then n integers. Use a lambda predicate to print only even numbers in their original order.",
    "urdu": "لیمبڈا کی شرط سے صرف جفت اعداد اصل ترتیب میں دکھائیں۔",
    "hint": "The predicate returns n % 2 == 0. Apply it before printing each value.",
    "solution": "#include <iostream>\n\nint main() {\n    int n{};std::cin>>n;\n    auto even=[](int x){return x%2==0;};\n    for(int i=0;i<n;++i){int x{};std::cin>>x;if(even(x))std::cout<<x<<\" \";}\n}\n",
    "starter": "#include <iostream>\n\nint main() {\n    // Write your solution here.\n    return 0;\n}\n",
    "tests": [
      {
        "input": "6\n1 2 3 4 5 6",
        "expected": "2 4 6"
      },
      {
        "input": "3\n1 3 5",
        "expected": ""
      },
      {
        "input": "4\n-4 -3 0 2",
        "expected": "-4 0 2"
      }
    ]
  }
];
function cleanPractice(p={}){return {mode:['exercise','lesson','free'].includes(p?.mode)?p.mode:'exercise',exercise:exercises.some(x=>x.id===p?.exercise)?p.exercise:1,drafts:Object.fromEntries(Object.entries(p?.drafts||{}).filter(([k,v])=>/^(e\d+|l\d+|free)$/.test(k)&&typeof v==='string'&&v.length<100000)),inputs:Object.fromEntries(Object.entries(p?.inputs||{}).filter(([k,v])=>typeof v==='string'&&v.length<100000)),solved:Object.fromEntries(Object.entries(p?.solved||{}).filter(([k,v])=>exercises.some(x=>String(x.id)===k)&&typeof v==='string'))};}
state.practice=cleanPractice(state.practice);
function selectedExercise(){return exercises.find(x=>x.id===state.practice.exercise)||exercises[0];}
function draftKey(){return state.practice.mode==='exercise'?'e'+state.practice.exercise:state.practice.mode==='lesson'?'l'+current:'free';}
function starterCode(){return state.practice.mode==='exercise'?selectedExercise().starter:state.practice.mode==='lesson'?(lessons.find(x=>x.id===current)||lessons[0]).code:'#include <iostream>\n\nint main() {\n    // Your C++ program\n    return 0;\n}\n';}
const $=s=>document.querySelector(s);const percent=()=>Math.round(state.done.length/Math.max(1,lessons.length)*100);
function save(){try{localStorage.setItem('safar-v1',JSON.stringify(state));}catch{toast('Browser storage is unavailable. Export your progress to keep it.');}}
function toast(t){$('#toast').textContent=t;$('#toast').classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),3300);}
function go(r,id){route=r;if(id){current=Number(id);state.last=current;save();}document.body.classList.remove('menu-open');location.hash=r+(r==='lesson'?'/'+current:'');render();window.scrollTo(0,0);}
const labels={home:'Overview',learn:'Explore lessons',portal:'Practice portal',tutor:'Ask V3school',saved:'Saved lessons',progress:'My progress',install:'Install & offline'};
function nav(r,n){return `<button class="nav ${route===r||(r==='learn'&&route==='lesson')?'active':''}" data-go="${r}">${icon(n)}<span>${labels[r]}</span>${r==='saved'?`<span class="count">${state.saved.length}</span>`:''}</button>`;}
function shell(content){return `<button class="mobile-backdrop" aria-label="Close menu" data-action="menu"></button><aside><button class="brand" data-go="home"><span class="brandmark">V3</span><span>V3school<small>One step further</small></span></button><div class="nav-label">YOUR LEARNING SPACE</div>${nav('home','home')}${nav('learn','book')}${nav('portal','code')}${nav('tutor','chat')}<div class="nav-label">YOUR COLLECTION</div>${nav('saved','bookmark')}${nav('progress','chart')}<div class="sidebar-bottom"><div class="mini-card">${icon('spark')}<br><b>Understand one idea at a time.</b><p>Read the definition. Follow the steps. See the result.</p></div><button class="profile" data-action="profile"><span class="avatar">${esc(state.name.slice(0,1).toUpperCase())}</span><span><b>${esc(state.name)}</b><small>Personal learning space</small></span></button></div></aside><div class="shell"><header><button class="menu" aria-label="Open navigation" data-action="menu">${icon('menu')}</button><div class="breadcrumbs">My workspace <span style="padding:0 12px">/</span> <strong>${labels[route]||'Lesson'}</strong></div><div class="header-actions"><button class="btn white" data-update-app hidden>Apply update</button><form id="globalSearch" class="searchbar">${icon('search')}<input aria-label="Search all topics" placeholder="Search any C++ topic…" value="${route==='learn'?esc(query):''}"><kbd>/</kbd></form><div class="lang-switch" aria-label="Lesson language"><button data-lang="en" class="${lang==='en'?'on':''}">EN</button><button data-lang="both" class="${lang==='both'?'on':''}">EN + اردو</button></div></div></header><main class="main">${content}<footer class="footer"><span>Made for curious minds. Built for your next step.</span><span>V3school · English + اردو</span></footer></main></div>`;}
const tracks=[{name:'C++ essentials',desc:'Start small. Build a strong foundation.',icon:'code',key:'Foundations',badge:'START HERE',match:l=>/^([1-5])\./.test(l.group)}, {name:'Object-oriented programming',desc:'Think in objects. Bring ideas to life.',icon:'layers',key:'OOP',badge:'CORE SKILLS',match:l=>/^(6|8|9|10|11|16)\./.test(l.group)}, {name:'Modern C++',desc:'Write cleaner, safer, smarter code.',icon:'bolt',key:'Modern',badge:'BEYOND THE BOOK',match:l=>l.group.startsWith('Modern')||l.group==='Memory & safety'}, {name:'Build real-world skills',desc:'Tools, threads, and better software.',icon:'globe',key:'Practical',badge:'LEVEL UP',match:l=>l.group==='Concurrency'||l.group==='Design & tools'||/^(7|12|13|14|15)\./.test(l.group)}];
function dashboard(){let l=lessons.find(x=>x.id===state.last)||lessons[0];const week=Array.from({length:7},(_,i)=>{const d=new Date();d.setDate(d.getDate()-6+i);let key=d.toLocaleDateString('en-CA');return `<div class="day ${state.visits.includes(key)?'active':''}"><span>${state.visits.includes(key)?'✓':d.getDate()}</span>${d.toLocaleDateString('en',{weekday:'short'}).slice(0,1)}</div>`;}).join('');return `<div class="greeting"><div><h1>Your next chapter starts here <span style="font-size:22px">✦</span></h1><p>Clear definitions. Small steps. Real understanding.</p></div><span class="date-tag">${icon('calendar')}${new Date().toLocaleDateString('en',{month:'short',day:'numeric',year:'numeric'})}</span></div><section class="hero"><div><div class="eyebrow">YOUR C++ JOURNEY, SIMPLIFIED</div><h2>Learn C++.<br><span>One clear step at a time.</span></h2><p>From the language basics to modern C++.<br>Definitions, numbered explanations, and examples in English & Urdu.</p><button class="btn lime" data-go="lesson" data-id="${l.id}">${state.done.length?'Continue learning':'Start learning'} ${icon('arrow')}</button><button class="btn ghost" data-go="learn">Explore topics ↗</button></div><div class="hero-art" aria-hidden="true"><div class="orbit"></div><div class="orbit two"></div><div class="code-float"><div class="window-dots"><i></i><i></i><i></i></div><pre><b>#include</b> &lt;iostream&gt;\n\n<b>int</b> main() {\n  std::cout &lt;&lt; <b>"I can do this."</b>;\n  <b>return</b> 0;\n}</pre></div><div class="floating-code">{ }</div><div class="floating-tag">✓ &nbsp; Small steps. Real progress.</div></div></section><div class="stats">${[[lessons.length,'Topics & chapter guides','book'],[lessons.filter(x=>!x.overview).length,'Individual topic guides','bolt'],['2','Languages, one journey','globe'],[state.done.length,'Lessons completed','check']].map(([n,t,i])=>`<div class="stat"><span class="stat-icon">${icon(i)}</span><div><strong>${n}</strong><small>${t}</small></div></div>`).join('')}</div><div class="columns"><div><div class="section-head"><h2>${state.done.length?'Pick up where you left off':'Your first small step'}</h2><button data-go="progress">My progress ${icon('arrow')}</button></div><div class="resume"><span class="resume-icon">&lt;/&gt;</span><div class="resume-copy"><div class="eyebrow">${esc(l.group)} · ${l.minutes} MIN</div><h3>${esc(l.title)}</h3><p>${state.done.includes(l.id)?'Completed — revisit the explanation':'A definition, three clear steps, and an explained example.'}</p><div class="progress-track"><i style="width:${percent()}%"></i></div><p>${state.done.length} of ${lessons.length} lessons complete</p></div><button class="btn" data-go="lesson" data-id="${l.id}">Let's go ${icon('arrow')}</button></div><div class="section-head"><h2>Find your learning path</h2><button data-go="learn">View all topics ${icon('arrow')}</button></div><div class="tracks">${tracks.map(t=>`<button class="track" data-track="${t.key}"><div class="track-top"><span class="track-icon">${icon(t.icon)}</span><span class="tag ${t.key==='Modern'?'new':''}">${t.badge}</span></div><h3>${t.name}</h3><p>${t.desc}</p><div class="track-footer"><span>${lessons.filter(t.match).length} lessons · Learn at your pace</span>${icon('arrow')}</div></button>`).join('')}</div></div><div class="dashboard-right"><section class="side-panel"><div class="section-head"><h3>Keep showing up</h3>${icon('calendar')}</div><div class="week">${week}</div><div style="font-size:12px"><b>${state.visits.length} learning day${state.visits.length===1?'':'s'}</b> <span style="color:#96a18b">and counting</span></div><p>Consistency grows with one small step.</p></section><section class="side-panel challenge"><span class="tag">A CLEARER WAY TO LEARN</span><h3>Understand the why.</h3><p>Every lesson has a definition, numbered explanations, and an example with its output.</p><div class="reading-sequence"><span>01 · Definition</span><span>02 · Step-by-step explanation</span><span>03 · Code & result</span></div><button class="btn" data-go="learn">Find your next concept ${icon('arrow')}</button></section><div class="tip">${icon('spark')}<span>Stuck on a concept? Ask V3school to find an explanation in both languages.</span></div></div></div>`;}
function matches(l,q){return (l.title+' '+l.ur+' '+l.tags+' '+l.definition+' '+l.definitionUr+' '+l.urdu+' '+l.group).toLowerCase().includes(q.toLowerCase());}
function filtered(){return lessons.filter(l=>(filter==='All'||filter===l.group||filter==='Topics'&&!l.overview||filter==='Guides'&&l.overview||filter==='Book'&&/^\d/.test(l.group)||filter==='Concurrency'&&l.group==='Concurrency'||tracks.find(t=>t.key===filter)?.match(l))&&(!query||matches(l,query)));}
function cards(items){return items.map(l=>`<button class="lesson-card" data-go="lesson" data-id="${l.id}"><div style="display:flex;justify-content:space-between"><span class="tag">${esc(l.group)}</span>${state.done.includes(l.id)?icon('check'):state.saved.includes(l.id)?icon('bookmark'):''}</div><h3>${esc(l.title)}</h3>${lang==='both'?`<div class="urdu" lang="ur">${esc(l.ur)}</div>`:''}<p>${esc(l.definition)}</p><small>${l.minutes} min · Steps + explained example &nbsp; →</small></button>`).join('')||'<div class="empty">No lessons found. Try a shorter term, such as “pointer”, “loop” or “lambda”.</div>';}
function catalog(saved=false){const items=saved?lessons.filter(l=>state.saved.includes(l.id)):filtered();return `<h1 class="page-title">${saved?'Your saved lessons':'A world of C++, one concept at a time.'}</h1><p class="subtitle">${saved?'Keep the ideas you want to come back to.':`${lessons.length} topics and chapter guides · Basics, OOP, standard library, modern C++, and tools.`}</p>${saved?'':`<input class="catalog-search" id="catalogQuery" aria-label="Filter lessons" value="${esc(query)}" placeholder="Find pointers, classes, lambdas… or search in Urdu"><div class="chapter-picker"><label for="chapterSelect">Browse a chapter</label><select id="chapterSelect"><option value="All">All chapters & subjects</option>${[...new Set(lessons.map(l=>l.group))].sort((a,b)=>{const an=parseInt(a),bn=parseInt(b);return Number.isNaN(an)?Number.isNaN(bn)?a.localeCompare(b):1:Number.isNaN(bn)?-1:an-bn;}).map(g=>`<option value="${esc(g)}" ${filter===g?'selected':''}>${esc(g)}</option>`).join('')}</select></div><div class="filter-row">${['All','Topics','Guides','Book','Foundations','OOP','Modern','Concurrency','Practical'].map(t=>`<button class="chip ${filter===t?'selected':''}" data-filter="${t}">${t==='All'?'All topics':t==='Book'?'From the book':t}</button>`).join('')}</div>`}<div class="result-count" id="resultCount">${items.length} lessons</div><div class="lesson-grid" id="lessonGrid">${cards(items)}</div>`;}
function codeblock(code){return `<div class="code"><div class="code-header"><span>C++ · A SIMPLE EXAMPLE</span><button data-action="copy">Copy code</button></div><pre>${esc(code)}</pre></div>`;}
function lesson(){
 const l=lessons.find(x=>x.id===current)||lessons[0];
 const related=lessons.filter(x=>x.group===l.group&&x.id!==l.id).sort((a,b)=>Number(a.overview)-Number(b.overview));
 const sections=[['definition','Definition'],['steps','Step by step'],['example','Code example'],['result','Expected output'],['remember','Remember']];
 return `<button class="back" data-go="learn">${icon('back')} All topics</button><div class="lesson-layout"><article class="lesson-body"><div class="reader-meta"><span class="tag">${esc(l.group)}</span><span class="tag">${l.overview?'CHAPTER GUIDE':'INDIVIDUAL TOPIC'}</span><span>${l.minutes} min read</span></div><h1>${esc(l.title)}</h1>${lang==='both'?`<div class="urdu lesson-title-ur" lang="ur">${esc(l.ur)}</div>`:''}<div class="reader-jump">${sections.map(([id,t])=>`<a href="#${id}" data-section="${id}">${t}</a>`).join('')}</div><section id="definition" class="reader-section"><div class="section-kicker">01 / THE MEANING</div><h2>What is ${esc(l.title)}?</h2><div class="definition-box"><span class="language-tag">ENGLISH DEFINITION</span><p class="definition">${esc(l.definition)}</p>${lang==='both'?`<div class="definition-ur"><span class="language-tag">اردو تعریف</span><p class="urdu" lang="ur">${esc(l.definitionUr)}</p></div>`:''}</div></section><section id="steps" class="reader-section"><div class="section-kicker">02 / BUILD YOUR UNDERSTANDING</div><h2>Let's understand it, step by step.</h2><div class="lesson-steps">${l.steps.map((st,i)=>`<div class="lesson-step"><span class="step-num">${i+1}</span><div class="step-content"><h3>${esc(st.title)}</h3><p>${esc(st.en)}</p>${lang==='both'?`<p class="urdu step-ur" lang="ur">${esc(st.ur)}</p>`:''}</div></div>`).join('')}</div></section><section id="example" class="reader-section"><div class="section-kicker">03 / SEE THE IDEA IN CODE</div><h2>A small, complete example.</h2><p class="example-intro">Read the code from top to bottom and connect it to the numbered explanation above. This is a complete C++23 program.</p>${codeblock(l.code)}${l.supportingCode?`<h3>${esc(l.supportingLabel)}</h3><div class="code"><pre>${esc(l.supportingCode)}</pre></div>`:''}</section><section id="result" class="reader-section"><div class="section-kicker">04 / CONNECT CODE TO RESULT</div><h2>What this program produces.</h2>${l.sampleInput?`<label class="language-tag">EXAMPLE INPUT</label><pre class="sample-input">${esc(l.sampleInput)}</pre>`:''}<div class="expected-output"><div class="code-header"><span>EXPECTED OUTPUT</span><span>✓ Verified example</span></div><pre>${esc(l.output||'(No console output)')}</pre></div><p class="small-note">${esc(l.outputNote||'Expected output for the displayed example.')}</p></section><section id="remember" class="reader-section"><div class="remember-box">${icon('spark')}<div><h3>Keep this in mind</h3><p>${esc(l.takeaway)}</p></div></div></section><div class="lesson-actions"><button class="btn ${state.done.includes(l.id)?'white':''}" data-action="complete">${icon('check')}${state.done.includes(l.id)?'Completed · undo':'I understand this topic'}</button><button class="btn white" data-action="bookmark">${icon('bookmark')}${state.saved.includes(l.id)?'Saved':'Save topic'}</button><button class="btn white" data-action="askLesson">${icon('chat')} Find related explanations</button></div><p class="small-note">${esc(l.source)} · Original learning notes and examples.</p></article><div class="reader-side"><section class="side-panel"><span class="eyebrow">ON THIS PAGE</span><nav class="page-toc">${sections.map(([id,t],i)=>`<a href="#${id}" data-section="${id}"><span>0${i+1}</span>${t}</a>`).join('')}</nav></section><section class="side-panel toc"><h3>Related topics</h3>${related.slice(0,12).map(x=>`<button data-go="lesson" data-id="${x.id}">${state.done.includes(x.id)?'✓ ':''}${esc(x.title)}</button>`).join('')||'<p>Explore the topic library for your next concept.</p>'}</section><button class="btn white" data-go="lesson" data-id="${current===lessons.length?1:current+1}">Next topic ${icon('arrow')}</button></div></div>`;
}
function practice(){const p=state.practice,e=selectedExercise(),l=lessons.find(x=>x.id===current)||lessons[0],key=draftKey();return `<div class="section-head"><div><div class="eyebrow practice-eyebrow">LEARN IT. WRITE IT. MAKE IT WORK.</div><h1 class="page-title">Practice portal</h1><p class="subtitle">Your code. Your pace. One problem at a time.</p></div><span class="tag">${Object.keys(p.solved).length} / ${exercises.length} exercises passed</span></div><div class="filter-row">${[['exercise','Guided exercises'],['lesson','Lesson practice'],['free','Free coding']].map(([m,t])=>`<button class="chip ${p.mode===m?'selected':''}" data-practice-mode="${m}">${t}</button>`).join('')}</div><p class="offline-callout" data-network-note hidden>You can write and save offline. Reconnect to run C++ or check answers.</p><div class="practice-workspace">${p.mode==='exercise'?`<section class="exercise-list" aria-label="Exercises">${exercises.map(x=>`<button class="exercise-item ${x.id===e.id?'selected':''}" data-exercise="${x.id}"><span class="exercise-number">${p.solved[x.id]?'✓':String(x.id).padStart(2,'0')}</span><span><b>${esc(x.title)}</b><small>${esc(x.level)} · ${esc(x.topic)}</small></span></button>`).join('')}</section>`:''}<div class="practice-main"><section class="practice-task"><span class="tag">${p.mode==='exercise'?esc(e.level):p.mode==='lesson'?'186 lesson examples':'C++23 · GCC'}</span><h2>${esc(p.mode==='exercise'?e.title:p.mode==='lesson'?l.title:'Build something of your own')}</h2>${p.mode==='lesson'?`<label for="exampleSelect">Choose a topic</label><select id="exampleSelect">${lessons.map(x=>`<option value="${x.id}" ${x.id===current?'selected':''}>${esc(x.title)}</option>`).join('')}</select>`:''}<p>${esc(p.mode==='exercise'?e.prompt:p.mode==='lesson'?l.practice:'Write any C++ program, enter input, and run it. Download your work as main.cpp.')}</p>${p.mode==='exercise'?`<p class="urdu" lang="ur" dir="rtl">${esc(e.urdu)}</p><div class="sample-grid"><div><small>EXAMPLE INPUT</small><pre>${esc(e.tests[0].input||'(No input)')}</pre></div><div><small>EXPECTED OUTPUT</small><pre>${esc(e.tests[0].expected||'(No output)')}</pre></div></div><details><summary>Need a hint?</summary><p>${esc(e.hint)}</p></details><details><summary>View explained solution</summary><p>${esc(e.hint)}</p><pre>${esc(e.solution)}</pre><p>Trace the input through each statement, then compare the output with the example above.</p></details>`:p.mode==='lesson'?`<button class="btn white" data-go="lesson" data-id="${l.id}">Read explanation →</button>`:''}</section><section class="editor-card"><div class="editor-toolbar"><b>main.cpp</b><small>Draft saves on this device</small></div><textarea id="editor" class="editor" aria-label="C++ code editor" spellcheck="false" autocapitalize="off" autocomplete="off">${esc(p.drafts[key]??(p.mode==='lesson'?state.drafts[current]:undefined)??starterCode())}</textarea><div class="editor-bottom"><label for="stdin">Program input (stdin)</label><textarea id="stdin" class="stdin" placeholder="Enter the values your program reads…">${esc(p.inputs[key]??(p.mode==='exercise'?e.tests[0].input:p.mode==='lesson'?l.sampleInput||'':''))}</textarea><div class="button-row"><button class="btn" id="run" data-action="run">${icon('play')} Run code</button>${p.mode==='exercise'?'<button class="btn white" id="checkAnswer" data-action="checkanswer">✓ Check answer</button>':''}<button class="btn white" data-action="checkcode">Find common mistakes</button><button class="btn white" data-action="resetpractice">Reset</button><button class="btn white" data-action="download">Download .cpp</button></div><p class="small-note">Run and Check answer send code and input to <a href="https://godbolt.org" target="_blank" rel="noopener">Compiler Explorer</a>. Internet required. Tests compare output, ignoring extra whitespace.</p></div></section><section class="editor-card practice-results"><div class="editor-toolbar"><b>Output & feedback</b><span id="runStatus">Ready</span></div><pre class="output" id="output" aria-live="polite">Write your solution, then run it or check your answer.</pre><div class="hint" id="fixhint" hidden></div></section></div></div>`;}
function normalizedOutput(s){return s.trim().replace(/\s+/g,' ');}
function gradeResult(data,expected){const build=data.buildResult||data,ex=data.execResult||(data.didExecute?data:null);const diagnostic=[...(build.stderr||[]),...(ex?.stderr||[])].map(x=>x.text||'').join('\n');const actual=(ex?.stdout||[]).map(x=>x.text||'').join('\n');return {passed:build.code===0&&!!ex&&ex.code===0&&!ex.timedOut&&normalizedOutput(actual)===normalizedOutput(expected),actual,diagnostic,compiled:build.code===0,executed:!!ex};}
async function checkAnswer(){if(running)return;if(!navigator.onLine){toast('Reconnect to check your answer. Your draft is saved.');return;}running=true;const e=selectedExercise(),source=$('#editor').value,out=$('#output'),status=$('#runStatus'),fix=$('#fixhint'),button=$('#checkAnswer');button.disabled=true;fix.hidden=true;fix.textContent='';out.textContent='Checking your solution…';let passed=0,report=[];try{for(let i=0;i<e.tests.length;i++){status.textContent=`Checking ${i+1} / ${e.tests.length}`;const c=new AbortController(),timer=setTimeout(()=>c.abort(),30000);try{if(!compiler){const r=await fetch('https://godbolt.org/api/compilers/c++',{headers:{Accept:'application/json'},signal:c.signal});if(!r.ok)throw Error('Compiler unavailable');const list=await r.json();compiler=list.find(x=>x.id==='g141')?.id||list.find(x=>/^g14\d$/.test(x.id))?.id;if(!compiler)throw Error('Supported compiler unavailable');}const t=e.tests[i],r=await fetch(`https://godbolt.org/api/compiler/${compiler}/compile`,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},signal:c.signal,body:JSON.stringify({source,lang:'c++',allowStoreCodeDebug:false,options:{userArguments:'-std=c++23 -O0 -Wall -Wextra -pthread',compilerOptions:{executorRequest:true},filters:{execute:true},executeParameters:{args:[],stdin:t.input},tools:[],libraries:[]}})});if(!r.ok)throw Error('Compiler service returned '+r.status);state.runs++;const g=gradeResult(await r.json(),t.expected);if(g.passed)passed++;report.push(`Test ${i+1}: ${g.passed?'PASS':'NEEDS A FIX'}\nInput: ${t.input||'(none)'}\nExpected: ${t.expected||'(empty)'}\nYour output: ${g.actual||'(empty)'}${g.diagnostic?'\nDiagnostics: '+g.diagnostic:''}`);out.textContent=report.join('\n\n');if(!g.compiled||!g.executed){fix.textContent=g.diagnostic?hints(g.diagnostic):'No execution result was returned. Try running again.';fix.hidden=false;report.push('Remaining tests were not checked.');break;}}finally{clearTimeout(timer);}}status.textContent=`${passed} / ${e.tests.length} tests passed`;out.textContent=report.join('\n\n');if(passed===e.tests.length){state.practice.solved[e.id]=new Date().toISOString();out.textContent+='\n\nAll provided tests passed! Review the required technique too; output tests cannot check every possible input.';toast('Exercise passed! Progress saved.');}else{fix.hidden=false;if(!fix.textContent)fix.textContent='Compare expected output with yours. Check boundaries, input order and extra printed labels, then try again. / متوقع نتیجے سے اپنا نتیجہ ملائیں، پھر دوبارہ کوشش کریں۔';}}catch(err){status.textContent='Check incomplete';out.textContent=report.join('\n\n')+'\n\n'+(err.name==='AbortError'?'Request timed out.':err.message)+' Remaining tests were not checked. Your draft is saved.';}finally{save();running=false;button.disabled=!navigator.onLine;}}

let aiBusy=false,chatMode='ai';
function formatAI(text){return text.split(/```(?:[a-zA-Z0-9_+.-]*)\n?/g).map((part,i)=>i%2?'<pre class="ai-code">'+esc(part)+'</pre>':'<div class="ai-text" dir="auto">'+esc(part)+'</div>').join('');}
function tutor(){return `<div class="chat-wrap"><div class="chat-intro"><div class="chat-symbol">${icon('spark')}</div><h1 class="page-title">Ask. Understand. Keep learning.</h1><p class="subtitle">V3school × Gemini · English + اردو</p><div class="filter-row"><button class="chip ${chatMode==='ai'?'selected':''}" data-chat-mode="ai">Ask Gemini</button><button class="chip ${chatMode==='library'?'selected':''}" data-chat-mode="library">Offline lesson search</button><button class="chip" data-new-chat>New chat</button></div><p class="small-note">${chatMode==='ai'?'Ask about C++, schoolwork, or any other topic. Questions and recent replies are sent to Google Gemini. Internet required. AI can make mistakes.':'Search the downloaded C++ guides without internet.'}</p><div class="suggestions">${['Explain pointers simply','Help me fix a C++ error','What is gravity?','لوپ کیا ہے؟'].map(t=>`<button class="chip" data-question="${t}" ${aiBusy?'disabled':''}>${t}</button>`).join('')}</div></div><div id="messages" aria-live="polite">${chat.map(m=>`<div class="chat-message ${m.role==='user'?'user':''}">${m.html||(m.role==='assistant'?formatAI(m.text):esc(m.text))}</div>`).join('')}${aiBusy?'<div class="chat-message">Gemini is thinking…</div>':''}</div><form id="chatForm" class="chat-form"><input id="chatInput" aria-label="Ask a question" placeholder="Ask anything… اردو میں بھی" required maxlength="6000" ${aiBusy?'disabled':''}><button aria-label="Send question" ${aiBusy?'disabled':''}>${icon('send')}</button></form></div>`;}
async function answer(q){if(chatMode==='library'){libraryAnswer(q);return;}if(aiBusy)return;if(!navigator.onLine){toast('Gemini needs internet. Choose Offline lesson search to keep learning.');return;}chat.push({role:'user',text:q});aiBusy=true;render();const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),55000);try{let history=chat.filter(x=>x.text&&!x.error&&!x.html).slice(-11);while(history[0]?.role==='assistant')history.shift();history=history.map(x=>({role:x.role,text:x.text.slice(0,6000)}));while(JSON.stringify(history).length>19000&&history.length>1)history.splice(0,2);const response=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:history.map(x=>({role:x.role,text:x.text})),language:lang}),signal:controller.signal});const data=await response.json();if(!response.ok)throw Error(data.error||'Gemini is unavailable.');chat.push({role:'assistant',text:data.text+(data.truncated?'\n\n[Reply shortened. Ask me to continue.]':'')});}catch(e){chat.pop();chat.push({role:'assistant',error:true,text:(e.name==='AbortError'?'The request timed out. Please try again.':e.message)+'\nYour question: '+q});}finally{clearTimeout(timeout);aiBusy=false;if(route==='tutor'){render();$('#chatInput')?.focus();$('#chatForm')?.scrollIntoView({block:'end',behavior:'smooth'});}}}

function libraryAnswer(q){chat.push({role:'user',text:q});let terms=q.toLowerCase().replace(/[?؟.,]/g,'').split(/\s+/).filter(w=>w.length>1&&!['what','is','the','how','does','explain','about','please','with','and','are','code','example','میں','کیا','ہے'].includes(w));let ranked=lessons.map(l=>({l,s:terms.reduce((n,t)=>n+(l.title.toLowerCase()===t?12:l.title.toLowerCase().includes(t)?5:matches(l,t)?1:0),0)})).filter(x=>x.s>0).sort((a,b)=>b.s-a.s||Number(a.l.overview)-Number(b.l.overview));if(!ranked.length){chat.push({role:'assistant',html:'I couldn’t match that to a lesson yet. Try a specific topic like <b>inheritance</b>, <b>std::vector</b> or <b>پوائنٹر</b>. For code errors, use the playground’s compiler diagnostics.'});}else{let l=ranked[0].l;chat.push({role:'assistant',html:`<span class="tag">FROM THE LESSON LIBRARY</span><h3 style="margin-top:12px">${esc(l.title)}</h3><p>${esc(l.definition)}</p><ol class="tutor-steps">${l.steps.map(st=>`<li><b>${esc(st.title)}</b><p>${esc(st.en)}</p>${lang==='both'?`<p class="urdu" lang="ur">${esc(st.ur)}</p>`:''}</li>`).join('')}</ol>${lang==='both'?`<p class="urdu" lang="ur">${esc(l.urdu)}</p>`:''}<div class="code"><pre>${esc(l.code)}</pre></div><div class="button-row"><button class="btn white" data-go="lesson" data-id="${l.id}">Open lesson</button></div><p class="small-note">${esc(l.source)}${ranked.length>1?' · Also explore: '+ranked.slice(1,3).map(x=>`<button data-go="lesson" data-id="${x.l.id}">${esc(x.l.title)}</button>`).join(', '):''}</p>`});}render();$('#chatInput').focus();$('#chatForm').scrollIntoView({block:'end',behavior:'smooth'});}
function progress(){return `<h1 class="page-title">Small steps, visible progress.</h1><p class="subtitle">Your progress is saved on this browser. Export it to carry it to another device.</p><div class="stats">${[[state.done.length,'Completed'],[state.saved.length,'Saved lessons'],[state.runs,'Compiler requests'],[state.visits.length,'Learning days']].map(([n,t])=>`<div class="stat"><div><strong>${n}</strong><small>${t}</small></div></div>`).join('')}</div><section class="side-panel"><h3>Your learning journey</h3><div class="progress-circle">${percent()}%</div><div class="progress-track"><i style="width:${percent()}%"></i></div><p>${state.done.length} of ${lessons.length} lessons complete. You set the pace.</p><div class="settings-row"><button class="btn" data-action="export">${icon('download')} Export progress</button><button class="btn white" data-action="import">Import progress</button><input type="file" id="importFile" accept="application/json" hidden><button class="btn white" data-action="profile">Edit learner name</button></div></section><div class="section-head"><h2>Lessons you’ve completed</h2></div><div class="lesson-grid">${state.done.length?cards(lessons.filter(l=>state.done.includes(l.id))):'<div class="empty">Your journey is just starting. Complete your first lesson to see it here.<br><button class="btn" style="margin-top:18px" data-go="lesson" data-id="1">Start lesson one →</button></div>'}</div>`;}
function render(){const page={home:dashboard,learn:()=>catalog(),saved:()=>catalog(true),lesson,portal:practice,tutor,progress,install:installPage}[route]||dashboard;$('#app').innerHTML=shell(page());window.V3PWA?.refresh();}
function download(name,text,type){const u=URL.createObjectURL(new Blob([text],{type}));const a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
function hints(s){let h=[];if(/expected.*[;]|expected.*semicolon/i.test(s))h.push('A statement likely needs a semicolon (;). Check the reported line and the line just before it. / بیان کے آخر میں سیمی کولن دیکھیں۔');if(/not declared|undeclared identifier/i.test(s))h.push('Check the variable spelling, declaration and scope. Standard names such as cout need std:: and the right header. / نام، سکوپ اور ہیڈر چیک کریں۔');if(/no matching|invalid conversion|cannot convert/i.test(s))h.push('The types or arguments do not match. Compare the function parameters with the values you supplied. / آرگومنٹ اور پیرامیٹر کی ٹائپس ملائیں۔');if(/expected.*[}]|end of input/i.test(s))h.push('Check that each opening brace has a closing brace. / ہر کھلنے والی بریس کی بند بریس دیکھیں۔');if(/undefined reference/i.test(s))h.push('A declared function may be missing its definition, or a required library is not linked. / فنکشن کی تعریف اور لنکنگ چیک کریں۔');if(/constraint|integral/i.test(s))h.push('A template requirement may not accept this type. Read the constraint in the lesson. / ٹیمپلیٹ کی شرط دیکھیں۔');return h.length?h.join('\n\n'):'Read the first diagnostic first: line and column point to where the compiler noticed the problem. Fix one issue, then run again. / پہلے پیغام کی لائن دیکھیں، ایک غلطی درست کریں پھر دوبارہ چلائیں۔';}
async function runCode(){if(running)return;if(typeof navigator!=='undefined'&&navigator.onLine===false){toast('Code execution needs internet. Lessons and code editing work offline.');return;}running=true;const source=$('#editor').value,stdin=$('#stdin').value;const output=$('#output'),status=$('#runStatus'),button=$('#run'),fix=$('#fixhint');button.disabled=true;status.textContent='Compiling…';output.classList.remove('error');output.textContent='Sending code to Compiler Explorer…';fix.hidden=true;const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),30000);try{if(!compiler){const list=await fetch('https://godbolt.org/api/compilers/c++',{headers:{Accept:'application/json'},signal:controller.signal});if(!list.ok)throw Error('Compiler list unavailable');let cs=await list.json();compiler=cs.find(c=>c.id==='g141')?.id||cs.find(c=>/^g14\d$/.test(c.id))?.id;if(!compiler)throw Error('Supported GCC compiler unavailable');}let res=await fetch(`https://godbolt.org/api/compiler/${compiler}/compile`,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},signal:controller.signal,body:JSON.stringify({source,lang:'c++',allowStoreCodeDebug:false,options:{userArguments:'-std=c++23 -O0 -Wall -Wextra -pthread',compilerOptions:{executorRequest:true},filters:{execute:true},executeParameters:{args:[],stdin},tools:[],libraries:[]}})});if(!res.ok)throw Error('Compiler service returned '+res.status);const data=await res.json();const build=data.buildResult||data;const diag=[...(build.stdout||[]),...(build.stderr||[])].map(x=>x.text||'').join('\n').replace(/\x1b\[[0-9;]*[A-Za-z]/g,'');const execution=data.execResult||(data.didExecute?data:null);let buildFailed=build.code!==0&&build.code!==undefined;if(buildFailed){output.textContent=diag||'Compilation failed without a diagnostic.';output.classList.add('error');status.textContent='Needs a fix';fix.textContent=hints(diag);fix.hidden=false;}else if(execution){const out=[...(execution.stdout||[]),...(execution.stderr||[])].map(x=>x.text||'').join('\n');output.textContent=(diag?'Compiler messages:\n'+diag+'\n\n':'')+(out||'(No output)')+'\n\nProgram exit code: '+execution.code;status.textContent=execution.code===0?'Run complete':'Runtime issue';if(execution.code!==0){output.classList.add('error');fix.hidden=false;fix.textContent='The program compiled but exited unsuccessfully. Check inputs, bounds and program logic. / پروگرام کمپائل ہوا مگر کامیابی سے ختم نہیں ہوا۔';}}else{output.textContent=diag||'Compilation finished, but the service returned no execution result.';status.textContent='No execution result';}state.runs++;save();}catch(e){status.textContent='Compiler unavailable';output.classList.add('error');output.textContent='Could not reach the compiler. Your code is still saved.\n\n'+(e.name==='AbortError'?'The request timed out.':e.message)+'\n\nTry again, or download main.cpp and run locally:\ng++ -std=c++23 -Wall -Wextra -pthread main.cpp -o app\n./app';fix.hidden=false;fix.textContent='No code execution was verified. The common-mistakes checker is available offline, but is not a C++ compiler.';}finally{clearTimeout(timer);running=false;button.disabled=false;}}
function checkCode(){const s=$('#editor').value,found=[];s.split('\n').forEach((line,i)=>{if(/^\s*(std::)?cout\s*<</.test(line)&&!/[;{]\s*(\/\/.*)?$/.test(line)&&!line.trim().endsWith('<<'))found.push(`Line ${i+1}: possible missing semicolon after output.`);});if(/\bcout\b/.test(s)&&!/#include\s*<iostream>/.test(s))found.push('Output may need #include <iostream>.');if(!/\bmain\s*\(/.test(s))found.push('No main() entry point found.');if(/\bnew\b/.test(s)&&! /\bdelete\b/.test(s))found.push('Review ownership of new allocations. Prefer a smart pointer.');$('#output').textContent=found.length?found.join('\n'):'No common mistakes spotted by these limited checks. Run the compiler to verify syntax and execution.';$('#runStatus').textContent='Heuristic check only';$('#fixhint').hidden=false;$('#fixhint').textContent='This checks a few common patterns. It cannot prove that C++ code is correct. / یہ محدود جانچ ہے، مکمل کمپائلر نہیں۔';}
document.addEventListener('click',async e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.chatMode){if(aiBusy)return;chatMode=b.dataset.chatMode;chat=[];render();return;}if(b.hasAttribute('data-new-chat')){if(aiBusy)return;chat=[];render();return;}if(b.dataset.practiceMode){state.practice.mode=b.dataset.practiceMode;save();render();return;}if(b.dataset.exercise){state.practice.exercise=Number(b.dataset.exercise);save();render();return;}if(b.dataset.go){if(b.dataset.go==='learn'){query='';filter='All';}go(b.dataset.go,b.dataset.id);return;}if(b.dataset.lang){lang=b.dataset.lang;render();return;}if(b.dataset.track){filter=b.dataset.track;query='';go('learn');return;}if(b.dataset.filter){filter=b.dataset.filter;render();return;}if(b.dataset.question){answer(b.dataset.question);return;}const a=b.dataset.action;const l=lessons.find(x=>x.id===current);if(a==='menu')document.body.classList.toggle('menu-open');if(a==='complete'){state.done=state.done.includes(current)?state.done.filter(x=>x!==current):[...state.done,current];save();render();}if(a==='bookmark'){state.saved=state.saved.includes(current)?state.saved.filter(x=>x!==current):[...state.saved,current];save();render();}if(a==='copy'){try{await navigator.clipboard.writeText(l.code);toast('Code copied');}catch{toast('Select the example text to copy it.');}}if(a==='askLesson'){go('tutor');answer('Explain '+l.title);}if(a==='checkanswer')checkAnswer();if(a==='resetpractice'){if(confirm('Reset this draft to its starting code?')){delete state.practice.drafts[draftKey()];if(state.practice.mode==='lesson')delete state.drafts[current];save();render();}}if(a==='run')runCode();if(a==='checkcode')checkCode();if(a==='resetcode'){if(confirm('Replace this draft with the original lesson example?')){delete state.drafts[current];save();render();}}if(a==='download')download('main.cpp',$('#editor').value,'text/plain');if(a==='export')download('v3school-progress.json',JSON.stringify({version:1,...state},null,2),'application/json');if(a==='import')$('#importFile').click();if(a==='profile'){const d=document.createElement('dialog');d.innerHTML='<h2>Make this space yours.</h2><p class="subtitle">Your name stays in this browser.</p><form method="dialog" id="profileForm"><label for="learnerName">Your name</label><input id="learnerName" maxlength="40" required value="'+esc(state.name)+'"><div class="button-row"><button class="btn" value="save">Save name</button><button class="btn white" type="button" id="closeProfile">Cancel</button></div></form>';document.body.append(d);d.showModal();$('#closeProfile').onclick=()=>d.close();$('#profileForm').onsubmit=()=>{state.name=$('#learnerName').value.trim()||'Learner';save();render();};d.onclose=()=>d.remove();}});
document.addEventListener('submit',e=>{if(e.target.id==='globalSearch'){e.preventDefault();query=e.target.querySelector('input').value.trim();filter='All';go('learn');}if(e.target.id==='chatForm'){e.preventDefault();let q=$('#chatInput').value.trim();if(q)answer(q);}});
document.addEventListener('input',e=>{if(e.target.id==='stdin'){state.practice.inputs[draftKey()]=e.target.value;save();}if(e.target.id==='catalogQuery'){query=e.target.value;const items=filtered();$('#lessonGrid').innerHTML=cards(items);$('#resultCount').textContent=items.length+' lessons';}if(e.target.id==='editor'){state.practice.drafts[draftKey()]=e.target.value;save();}});
document.addEventListener('change',async e=>{if(e.target.id==='chapterSelect'){filter=e.target.value;render();}if(e.target.id==='exampleSelect'){current=Number(e.target.value);go('portal',current);}if(e.target.id==='importFile'){try{const file=e.target.files[0];if(!file)return;if(file.size>2e6)throw Error();const s=JSON.parse(await file.text());if(s.version!==1||!Array.isArray(s.done)||!Array.isArray(s.saved)||typeof s.drafts!=='object'||s.drafts===null)throw Error();state={practice:cleanPractice(s.practice),name:typeof s.name==='string'?s.name.slice(0,40):'Learner',done:[...new Set(s.done.filter(id=>lessons.some(l=>l.id===id)))],saved:[...new Set(s.saved.filter(id=>lessons.some(l=>l.id===id)))],drafts:Object.fromEntries(Object.entries(s.drafts).filter(([k,v])=>/^\d+$/.test(k)&&typeof v==='string'&&v.length<100000)),visits:Array.isArray(s.visits)?s.visits.filter(x=>typeof x==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(x)):[],last:lessons.some(l=>l.id===s.last)?s.last:1,runs:Number.isSafeInteger(s.runs)&&s.runs>=0?s.runs:0};save();render();toast('Progress imported');}catch{toast('Please choose a valid V3school progress export.');}}});
document.addEventListener('keydown',e=>{if(e.target.id==='editor'&&e.key==='Tab'){e.preventDefault();const t=e.target,a=t.selectionStart,b=t.selectionEnd;t.value=t.value.slice(0,a)+'    '+t.value.slice(b);t.selectionStart=t.selectionEnd=a+4;state.practice.drafts[draftKey()]=t.value;save();}if(e.key==='/'&&!['INPUT','TEXTAREA'].includes(document.activeElement.tagName)){e.preventDefault();$('#globalSearch input').focus();}});
window.addEventListener('hashchange',()=>{let [r,id]=location.hash.slice(1).split('/');if(r==='practice')r='portal';if(r&&r!==route||r==='lesson'&&Number(id)!==current){route=labels[r]||r==='lesson'?r:'home';if(id&&lessons.some(l=>l.id===Number(id)))current=Number(id);render();}});
fetch('lessons.json').then(r=>{if(!r.ok)throw Error('Lessons unavailable');return r.json();}).then(data=>{lessons=data;const day=new Date().toLocaleDateString('en-CA');if(!state.visits.includes(day))state.visits.push(day);save();current=state.last;let [r,id]=location.hash.slice(1).split('/');if(r==='practice')r='portal';if(labels[r]||r==='lesson')route=r;if(id&&lessons.some(l=>l.id===Number(id)))current=Number(id);render();}).catch(()=>{$('#app').innerHTML='<div class="empty">The lesson library could not load. Please refresh when your connection is available.</div>';});

document.addEventListener('click',e=>{const link=e.target.closest('[data-section]');if(link){e.preventDefault();document.getElementById(link.dataset.section)?.scrollIntoView({behavior:'smooth',block:'start'});}});

function installPage(){return `<div class="section-head"><div><h1 class="page-title">V3school, wherever you learn.</h1><p class="subtitle">Install once. Keep your C++ library close.</p></div><img src="/icons/icon-192.png" width="64" height="64" style="border-radius:15px" alt="V3school app icon"></div><section class="side-panel offline-panel"><div class="eyebrow">YOUR OFFLINE LIBRARY</div><h2 data-offline-status>Checking offline readiness…</h2><p>Open the app online and wait for <b>Ready offline</b>. Then reopen it without internet to read all 186 guides, search in English or Urdu, use the lesson tutor, and save progress.</p><div class="button-row"><button class="btn" data-install-now hidden>${icon('download')} Install V3school</button><button class="btn white" data-offline-retry>Check download & updates</button><button class="btn" data-update-app hidden>Apply update</button></div><p data-installed-status></p></section><div class="install-grid"><section class="side-panel"><h3>iPhone & iPad</h3><ol><li>Open this app in <b>Safari</b>.</li><li>Tap <b>Share</b>, then <b>Add to Home Screen</b>.</li><li>If offered, turn on <b>Open as Web App</b>, then tap <b>Add</b>.</li><li>Open V3school from its icon while online and wait for <b>Ready offline</b>.</li></ol></section><section class="side-panel"><h3>Android</h3><ol><li>Open this app in <b>Chrome</b>.</li><li>Tap <b>Install V3school</b> here when available, or choose <b>Install app / Add to Home screen</b> from the browser menu.</li><li>Open the installed app and wait for <b>Ready offline</b>.</li></ol></section><section class="side-panel"><h3>Windows, Mac & Linux</h3><ol><li>Open this app in a current <b>Chrome or Edge</b> browser.</li><li>Use the address-bar install icon, the browser’s app menu, or the install button here.</li><li>Open V3school from your apps or desktop and confirm <b>Ready offline</b>.</li></ol><p>On supported Macs, Safari also offers File → Add to Dock. Menus vary by browser version.</p></section><section class="side-panel"><h3>What works without internet?</h3><ul><li>All downloaded lessons, definitions, Urdu explanations, code examples and expected outputs.</li><li>Topic search, the lesson-based tutor, bookmarks and progress.</li><li>Editing code and checking common mistakes.</li></ul><p>Running C++ uses an online compiler and needs internet. Updates also need a connection.</p></section></div><section class="side-panel"><h3>Keep your learning safe</h3><p>Each device keeps its own progress. Clearing browser/app data removes downloads and progress. Your browser may also reclaim storage. Export progress before switching devices.</p><div class="button-row"><button class="btn white" data-go="progress">Export or import progress</button><button class="btn white" data-keep-offline>Request persistent storage</button></div><p data-storage-status></p><p class="small-note">Installation depends on browser and operating-system support. If installation is unavailable, use the website in a supported browser.</p></section>`;}
