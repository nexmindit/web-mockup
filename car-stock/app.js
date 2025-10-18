document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".nav-link");
  const panels = document.querySelectorAll(".panel");

  const navActiveClasses = [
    "bg-slate-900",
    "text-white",
    "border-slate-900",
  ];
  const navInactiveClasses = [
    "bg-white",
    "text-slate-700",
    "border-slate-200",
  ];

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const targetId = link.dataset.target;

      navLinks.forEach((btn) => {
        const isActive = btn === link;
        navActiveClasses.forEach((cls) =>
          btn.classList.toggle(cls, isActive)
        );
        navInactiveClasses.forEach((cls) =>
          btn.classList.toggle(cls, !isActive)
        );
      });

      panels.forEach((panel) => {
        const shouldShow = panel.id === targetId;
        panel.classList.toggle("hidden", !shouldShow);
      });
    });
  });

  const stockTabs = document.querySelectorAll(".chip[data-target]");
  const stockTables = document.querySelectorAll(".table-wrapper");
  const tabActiveClasses = ["bg-slate-900", "text-white", "shadow"];
  const tabInactiveClasses = [
    "bg-slate-100",
    "text-slate-600",
    "hover:bg-slate-200",
  ];

  stockTabs.forEach((chip) => {
    chip.addEventListener("click", () => {
      const targetId = chip.dataset.target;
      stockTabs.forEach((tab) => {
        const isActive = tab === chip;
        tabActiveClasses.forEach((cls) => tab.classList.toggle(cls, isActive));
        tabInactiveClasses.forEach((cls) =>
          tab.classList.toggle(cls, !isActive)
        );
      });

      stockTables.forEach((table) => {
        const shouldShow = table.id === targetId;
        table.classList.toggle("hidden", !shouldShow);
      });
    });
  });

  const dropdownConfigs = Array.from(
    document.querySelectorAll("[data-dropdown]")
  )
    .map((container) => {
      const button = container.querySelector("[data-dropdown-button]");
      const panel = container.querySelector("[data-dropdown-panel]");

      if (!button || !panel) {
        return null;
      }

      panel.classList.add("hidden");
      button.setAttribute("aria-expanded", "false");

      return { container, button, panel };
    })
    .filter(Boolean);

  const closeDropdowns = () => {
    dropdownConfigs.forEach(({ button, panel }) => {
      if (!panel.classList.contains("hidden")) {
        panel.classList.add("hidden");
        button.setAttribute("aria-expanded", "false");
      }
    });
  };

  dropdownConfigs.forEach(({ container, button, panel }) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const shouldOpen = panel.classList.contains("hidden");
      closeDropdowns();
      if (shouldOpen) {
        panel.classList.remove("hidden");
        button.setAttribute("aria-expanded", "true");
      }
    });

    container.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeDropdowns();
      }
    });
  });

  document.addEventListener("click", (event) => {
    const isInsideDropdown = dropdownConfigs.some(({ container }) =>
      container.contains(event.target)
    );
    if (!isInsideDropdown) {
      closeDropdowns();
    }
  });

  const costInput = document.getElementById("cost");
  const interestInput = document.getElementById("interest-rate");
  const daysInput = document.getElementById("days-in-stock");
  const netCostInput = document.getElementById("net-cost");

  if (costInput && interestInput && daysInput && netCostInput) {
    const recalculateNetCost = () => {
      const baseCost = parseFloat(costInput.value) || 0;
      const interestRate = parseFloat(interestInput.value) || 0;
      const days = parseFloat(daysInput.value) || 0;

      if (baseCost <= 0 || interestRate <= 0 || days <= 0) {
        netCostInput.value = "";
        return;
      }

      const months = days / 30;
      const interestCost = baseCost * (interestRate / 100) * months;
      const netCost = baseCost + interestCost;
      netCostInput.value = netCost.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    };

    costInput.addEventListener("input", recalculateNetCost);
    interestInput.addEventListener("input", recalculateNetCost);
    daysInput.addEventListener("input", recalculateNetCost);
  }
});
