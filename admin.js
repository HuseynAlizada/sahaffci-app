// ===============================
// 🔧 Supabase Configuration
// ===============================
const SUPABASE_URL = "https://aoclihfphzsehhxhbazz.supabase.co";
const SUPABASE_ANON_KEY =
  "sb_publishable_a6lSetwX8YQg9XWhF-zYgQ_MDWLCvt_";
const supabaseClient  = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ===============================
// 🔐 Admin Authentication
// ===============================
const ADMIN_PASSWORD = "admin123";
let isAuthenticated = sessionStorage.getItem("adminAuthenticated") === "true";
const loginContainer = document.getElementById("login-container");
const adminContainer = document.getElementById("admin-container");
const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");
const logoutBtn = document.getElementById("logout-btn");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const password = document.getElementById("password").value.trim();
  if (password === ADMIN_PASSWORD) {
    sessionStorage.setItem("adminAuthenticated", "true");
    isAuthenticated = true;
    showAdminPanel();
  } else {
    loginError.textContent = "Incorrect password. Please try again.";
    document.getElementById("password").value = "";
  }
});

logoutBtn.addEventListener("click", () => {
  sessionStorage.removeItem("adminAuthenticated");
  isAuthenticated = false;
  showLoginScreen();
});

function showAdminPanel() {
  loginContainer.style.display = "none";
  adminContainer.style.display = "flex";
}

function showLoginScreen() {
  loginContainer.style.display = "flex";
  adminContainer.style.display = "none";
  loginError.textContent = "";
}

if (isAuthenticated) showAdminPanel();
else showLoginScreen();

// ===============================
// 🧭 Navigation
// ===============================
const navItems = document.querySelectorAll(".nav-item");
const formSections = document.querySelectorAll(".form-section");
const sectionTitle = document.getElementById("section-title");
const statusMessage = document.getElementById("status-message");

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    const sectionId = item.getAttribute("data-section");

    navItems.forEach((nav) => nav.classList.remove("active"));
    item.classList.add("active");

    formSections.forEach((section) => section.classList.remove("active"));
    document.getElementById(sectionId).classList.add("active");

    sectionTitle.textContent = item.textContent.trim();
    statusMessage.textContent = "";
  });
});

// ===============================
// 📤 Upload image to supabaseClient  Storage
// ===============================
async function uploadImage(file, folder = "images") {
  if (!file) return null;
  const fileName = `${folder}/${Date.now()}_${file.name}`;
  const { data, error } = await supabaseClient .storage.from("images").upload(fileName, file, {
    cacheControl: "3600",
    upsert: true,
  });
  if (error) throw error;

  const { data: publicUrlData } = supabaseClient .storage.from("images").getPublicUrl(fileName);
  return publicUrlData.publicUrl;
}

// ===============================
// 🖼️ Show image preview helper
// ===============================
function showImagePreview(input, imageUrl) {
  const previewId = `${input.id}-preview`;
  let preview = document.getElementById(previewId);

  if (!preview) {
    preview = document.createElement("img");
    preview.id = previewId;
    preview.className = "image-preview";
    preview.style.maxWidth = "200px";
    preview.style.marginTop = "10px";
    preview.style.borderRadius = "8px";
    preview.style.boxShadow = "0 2px 6px rgba(0,0,0,0.15)";
    input.insertAdjacentElement("afterend", preview);
  }
  
  if (imageUrl) {
    preview.src = imageUrl;
    preview.style.display = "block";
  } else {
    preview.src = "";
    preview.style.display = "none";
  }
}

// ===============================
// 💾 Form Submission (Save to supabaseClient )
// ===============================
const forms = document.querySelectorAll(".admin-form");

forms.forEach((form) => {
  // 🔸 Live preview when selecting new file
  form.querySelectorAll("input[type='file']").forEach((input) => {
    input.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => showImagePreview(input, reader.result);
        reader.readAsDataURL(file);
      }
    });
  });

  // 🔸 Submit form to supabaseClient 
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const tableName = form.getAttribute("data-table");
    const inputs = form.querySelectorAll("input[type='file']");
    const data = {};

    try {
      for (const input of inputs) {
        const file = input.files[0];
        if (file) {
          const imageUrl = await uploadImage(file, tableName);
          data[input.name] = imageUrl;
          showImagePreview(input, imageUrl);
        } else {
          // Use existing preview URL if no new file selected
          const previewImg = document.getElementById(`${input.id}-preview`);
          if (previewImg && previewImg.src) data[input.name] = previewImg.src;
        }
      }

      data.created_at = new Date().toISOString();

      const { data: existingData, error: fetchError } = await supabaseClient 
        .from(tableName)
        .select("id")
        .limit(1);

      if (fetchError) throw fetchError;

      let result;
      if (existingData && existingData.length > 0) {
        result = await supabaseClient .from(tableName).update(data).eq("id", existingData[0].id);
      } else {
        result = await supabaseClient .from(tableName).insert([data]);
      }

      if (result.error) throw result.error;
      showStatus(`✅ Images saved successfully to ${tableName}`, "success");
    } catch (error) {
      console.error("Save error:", error);
      showStatus(`❌ Error: ${error.message}`, "error");
    }
  });
});

// ===============================
// 📥 Load Data (Show previews)
// ===============================
const loadButtons = document.querySelectorAll(".load-btn");

loadButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const form = button.closest("form");
    const tableName = form.getAttribute("data-table");

    try {
      const { data, error } = await supabaseClient .from(tableName).select("*").limit(1).single();
      if (error) throw error;

      form.querySelectorAll("input[type='file']").forEach((input) => {
        const field = input.name;
        if (data[field]) showImagePreview(input, data[field]);
      });

      showStatus(`📷 Loaded existing images for ${tableName}`, "success");
    } catch (error) {
      console.error(error);
      showStatus(`❌ Error loading data: ${error.message}`, "error");
    }
  });
});

// ===============================
// 💬 Status Message
// ===============================
function showStatus(message, type) {
  statusMessage.textContent = message;
  statusMessage.className = `status ${type}`;
  setTimeout(() => {
    statusMessage.textContent = "";
    statusMessage.className = "status";
  }, 4000);
}

// ===============================
// 🚀 Auto-load previews on login
// ===============================
window.addEventListener("DOMContentLoaded", async () => {
  console.log("✅ Admin panel ready and supabaseClient  connected.");
  if (isAuthenticated) {
    const tables = [
      "home_banner",
      "our_atmosphere",
      "our_experience",
      "our_story",
      "shared_image",
      "menu_section",
    ];

    for (const table of tables) {
      try {
        const { data } = await supabaseClient .from(table).select("*").limit(1).single();
        if (data) {
          const form = document.querySelector(`form[data-table="${table}"]`);
          if (form) {
            form.querySelectorAll("input[type='file']").forEach((input) => {
              const field = input.name;
              if (data[field]) showImagePreview(input, data[field]);
            });
          }
        }
      } catch (err) {
        console.warn(`⚠️ Could not load ${table}:`, err.message);
      }
    }
  }
});
