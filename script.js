document.addEventListener("DOMContentLoaded", function () {
    var navbarShell = document.querySelector(".navbar-shell");
    var searchToggle = document.querySelector("[data-search-toggle]");
    var searchInput = document.querySelector("[data-compact-search-input]");
    var mobileSearchMedia = window.matchMedia("(max-width: 820px)");
    var menuToggle = document.querySelector("[data-menu-toggle]");
    var menuCloseButtons = document.querySelectorAll("[data-menu-close]");
    var menuDrawer = document.getElementById("mobileMenuDrawer");
    var menuGroupToggles = document.querySelectorAll("[data-menu-group-toggle]");
    var menuSelects = document.querySelectorAll("[data-menu-select]");
    var menuMedia = window.matchMedia("(max-width: 1080px)");
    var cartToggles = document.querySelectorAll("[data-cart-toggle]");
    var cartCloseButtons = document.querySelectorAll("[data-cart-close]");
    var cartDrawer = document.getElementById("cartDrawer");
    var cartCount = document.querySelector("[data-cart-count]");
    var cartBadges = document.querySelectorAll(".cart-badge");
    var setSearchState = function () { };
    var setMenuState = function () { };

    function closeMenuSelects() {
        menuSelects.forEach(function (select) {
            var toggle = select.querySelector("[data-menu-select-toggle]");

            select.classList.remove("menu-select-open");

            if (toggle) {
                toggle.setAttribute("aria-expanded", "false");
            }
        });
    }

    function applyMenuSelectValue(select, value) {
        var options = select.querySelectorAll("[data-menu-option]");
        var label = select.querySelector("[data-menu-select-label]");
        var image = select.querySelector("[data-menu-select-image]");
        var icon = select.querySelector("[data-menu-select-icon]");
        var activeOption = null;

        options.forEach(function (option) {
            var isActive = option.getAttribute("data-menu-value") === value;

            option.classList.toggle("menu-select-option-active", isActive);

            if (isActive) {
                activeOption = option;
            }
        });

        if (!activeOption) {
            activeOption = select.querySelector(".menu-select-option-active") || options[0];
        }

        if (!activeOption || !label) {
            return;
        }

        label.textContent = activeOption.getAttribute("data-menu-label") || "";

        if (image) {
            var nextImage = activeOption.getAttribute("data-menu-image");

            if (nextImage) {
                image.src = nextImage;
                image.alt = label.textContent;
            }
        }

        if (icon) {
            var nextIcon = activeOption.getAttribute("data-menu-icon");

            if (nextIcon) {
                icon.className = nextIcon + " menu-filter-currency-icon";
            }
        }
    }

    function syncMenuSelectGroup(group, value) {
        menuSelects.forEach(function (select) {
            if (select.getAttribute("data-menu-select-group") === group) {
                applyMenuSelectValue(select, value);
            }
        });
    }

    function syncMenuGroupIcon(group) {
        var toggle = group.querySelector("[data-menu-group-toggle]");
        var icon = toggle ? toggle.querySelector("i") : null;

        if (icon) {
            icon.className = group.classList.contains("menu-group-open") ? "bi bi-x-lg" : "bi bi-plus-lg";
        }
    }

    function resetMenuGroups() {
        menuGroupToggles.forEach(function (toggle) {
            var parentGroup = toggle.closest("[data-menu-group]");

            if (!parentGroup) {
                return;
            }

            parentGroup.classList.remove("menu-group-open");
            syncMenuGroupIcon(parentGroup);
        });
    }

    if (navbarShell && searchToggle && searchInput) {
        var searchIcon = searchToggle.querySelector("i");

        setSearchState = function (isOpen) {
            var shouldOpen = isOpen && mobileSearchMedia.matches;

            navbarShell.classList.toggle("compact-search-open", shouldOpen);
            document.body.classList.toggle("compact-search-active", shouldOpen);
            searchToggle.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
            searchToggle.setAttribute("aria-label", shouldOpen ? "Close search" : "Open search");

            if (mobileSearchMedia.matches) {
                searchInput.setAttribute("tabindex", shouldOpen ? "0" : "-1");
            } else {
                searchInput.removeAttribute("tabindex");
            }

            if (searchIcon) {
                searchIcon.className = shouldOpen ? "bi bi-x-lg" : "bi bi-search";
            }

            if (shouldOpen) {
                window.requestAnimationFrame(function () {
                    searchInput.focus();
                });
            }
        };

        searchToggle.addEventListener("click", function () {
            setMenuState(false);
            setSearchState(!navbarShell.classList.contains("compact-search-open"));
        });

        document.addEventListener("click", function (event) {
            if (!mobileSearchMedia.matches) {
                return;
            }

            if (!navbarShell.classList.contains("compact-search-open")) {
                return;
            }

            if (navbarShell.contains(event.target)) {
                return;
            }

            setSearchState(false);
        });

        function syncViewport() {
            if (!mobileSearchMedia.matches) {
                setSearchState(false);
            }
        }

        if (typeof mobileSearchMedia.addEventListener === "function") {
            mobileSearchMedia.addEventListener("change", syncViewport);
        } else if (typeof mobileSearchMedia.addListener === "function") {
            mobileSearchMedia.addListener(syncViewport);
        }

        setSearchState(false);
    }

    if (menuToggle && menuDrawer) {
        setMenuState = function (isOpen) {
            var shouldOpen = isOpen && menuMedia.matches;

            document.body.classList.toggle("menu-drawer-open", shouldOpen);
            menuDrawer.setAttribute("aria-hidden", shouldOpen ? "false" : "true");
            menuToggle.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
            menuToggle.setAttribute("aria-label", shouldOpen ? "Close menu" : "Open menu");

            if (!shouldOpen) {
                closeMenuSelects();
                resetMenuGroups();
            }
        };

        menuToggle.addEventListener("click", function () {
            closeCartDrawer();
            setSearchState(false);
            setMenuState(!document.body.classList.contains("menu-drawer-open"));
        });

        menuCloseButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                setMenuState(false);
            });
        });

        function syncMenuViewport() {
            if (!menuMedia.matches) {
                setMenuState(false);
            }
        }

        if (typeof menuMedia.addEventListener === "function") {
            menuMedia.addEventListener("change", syncMenuViewport);
        } else if (typeof menuMedia.addListener === "function") {
            menuMedia.addListener(syncMenuViewport);
        }

        setMenuState(false);
    }

    menuSelects.forEach(function (select) {
        var toggle = select.querySelector("[data-menu-select-toggle]");
        var options = select.querySelectorAll("[data-menu-option]");
        var group = select.getAttribute("data-menu-select-group");

        if (!toggle) {
            return;
        }

        toggle.addEventListener("click", function (event) {
            event.stopPropagation();

            var shouldOpen = !select.classList.contains("menu-select-open");
            closeMenuSelects();
            select.classList.toggle("menu-select-open", shouldOpen);
            toggle.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
        });

        options.forEach(function (option) {
            option.addEventListener("click", function () {
                var value = option.getAttribute("data-menu-value");

                if (group && value) {
                    syncMenuSelectGroup(group, value);
                } else if (value) {
                    applyMenuSelectValue(select, value);
                } else {
                    option.classList.add("menu-select-option-active");
                }

                closeMenuSelects();
            });
        });
    });

    menuSelects.forEach(function (select) {
        var activeOption = select.querySelector(".menu-select-option-active");
        var group = select.getAttribute("data-menu-select-group");
        var value = activeOption ? activeOption.getAttribute("data-menu-value") : "";

        if (group && value) {
            syncMenuSelectGroup(group, value);
        } else if (value) {
            applyMenuSelectValue(select, value);
        }
    });

    menuGroupToggles.forEach(function (toggle) {
        toggle.addEventListener("click", function () {
            var parentGroup = toggle.closest("[data-menu-group]");

            if (!parentGroup) {
                return;
            }

            parentGroup.classList.toggle("menu-group-open");
            syncMenuGroupIcon(parentGroup);
        });
    });

    resetMenuGroups();

    function updateCartCount() {
        if (!cartCount || cartBadges.length === 0) {
            return;
        }

        var totalItems = cartBadges[0].textContent.trim() || "0";
        cartCount.textContent = totalItems + " ITEMS";
    }

    function openCartDrawer() {
        if (!cartDrawer) {
            return;
        }

        document.body.classList.add("cart-drawer-open");
        cartDrawer.setAttribute("aria-hidden", "false");

        setSearchState(false);
        setMenuState(false);
    }

    function closeCartDrawer() {
        if (!cartDrawer) {
            return;
        }

        document.body.classList.remove("cart-drawer-open");
        cartDrawer.setAttribute("aria-hidden", "true");
    }

    cartToggles.forEach(function (toggle) {
        toggle.addEventListener("click", function (event) {
            event.preventDefault();
            updateCartCount();
            openCartDrawer();
        });
    });

    cartCloseButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            closeCartDrawer();
        });
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            setSearchState(false);
            setMenuState(false);
            closeCartDrawer();
        }
    });

    document.addEventListener("click", function (event) {
        if (!event.target.closest("[data-menu-select]")) {
            closeMenuSelects();
        }
    });

    updateCartCount();
});
