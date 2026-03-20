const api = "https://<YOUR_RAILWAY_BACKEND_URL>";

function showSection(id){
  document.querySelectorAll("#mainContent > div").forEach(d=>d.style.display="none");
  document.getElementById(id).style.display="block";
}

async function addStudent(){
  const s = {
    name: document.getElementById("name").value,
    grade: document.getElementById("grade").value,
    term: document.getElementById("term").value,
    subjects:{
      mathematics: +document.getElementById("math").value,
      english: +document.getElementById("english").value,
      kiswahili: +document.getElementById("kiswahili").value,
      integratedScience: +document.getElementById("science").value,
      agriculture: +document.getElementById("agri").value,
      socialStudies: +document.getElementById("social").value,
      preTechnical: +document.getElementById("pretech").value,
      religiousStudies: +document.getElementById("religion").value,
      creativeArts: +document.getElementById("creative").value
    },
    comment: document.getElementById("comment").value
  };

  const token = localStorage.getItem("token");
  if(!token){alert("Login required"); return;}

  const res = await fetch(`${api}/students`, {
    method:"POST",
    headers:{"Content-Type":"application/json","Authorization":token},
    body:JSON.stringify(s)
  });
  const data = await res.json();
  console.log(data);
  alert("Student added!");
  loadStudents();
}

async function loadStudents(){
  const token = localStorage.getItem("token");
  if(!token) return;
  const res = await fetch(`${api}/students`,{headers:{Authorization:token}});
  const students = await res.json();
  const tbody = document.querySelector("#resultsTable tbody");
  tbody.innerHTML="";
  students.forEach(s=>{
    const tr = document.createElement("tr");
    tr.innerHTML=`<td>${s.name}</td><td>${s.grade}</td><td>${s.term}</td><td>${s.total}</td><td>${s.mean}</td><td>${s.band}</td>`;
    tbody.appendChild(tr);
  });
  drawGraph(students);
}

function drawGraph(students){
  const ctx = document.getElementById("lineGraph").getContext("2d");
  if(window.chartInstance) window.chartInstance.destroy();
  const labels = ["Mathematics","English","Kiswahili","Integrated Science","Agriculture","Social Studies","Pre-Technical","Religious Studies","Creative Arts"];
  const dataset = students.map(s=>Object.values(s.subjects));
  window.chartInstance = new Chart(ctx,{
    type:"line",
    data:{labels, datasets:[{label:"Student Marks", data:dataset[0], borderColor:"blue"}]},
    options:{responsive:true}
  });
}

function downloadPDF(){
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFont("Times","normal");
  doc.setFontSize(14);
  const rows = [];
  document.querySelectorAll("#resultsTable tbody tr").forEach(tr=>{
    const tds = Array.from(tr.children).map(td=>td.innerText);
    rows.push(tds.join(" | "));
  });
  doc.text("CBC Report Cards",10,10);
  rows.forEach((r,i)=>doc.text(r,10,20+i*10));
  doc.save("CBC_ReportCards.pdf");
}

loadStudents();
