let basePrice = 0;

$(document).ready(function () {

    // =====================
    // MENU TOGGLE
    // =====================
    $('#myMenu').on('click', function (e) {
        $(this).toggleClass('active');
        e.stopPropagation();
    });

    $(document).on('click', function () {
        $('#myMenu').removeClass('active');
    });

    // =====================
    // SELECT2 INIT
    // =====================
    $('#district-select').select2({
        placeholder: "জেলা লিখে সার্চ করুন...",
        width: '100%'
    });

    $('#upazila-select').select2({
        placeholder: "উপজেলা লিখে সার্চ করুন...",
        width: '100%'
    });

    // =====================
    // UPDATE TOTALS FUNCTION
    // =====================
    function updateCartTotals() {

        let qty = parseInt($('.qty-input').val());

        let deliveryCharge = parseInt($('#delivery-option').val());

        let total = basePrice * qty;

        let grandTotal = total + deliveryCharge;

        // UI UPDATE
        $('.product-total').text(total + ' ৳');
        $('.sub-total').text(total + ' ৳');
        $('.grand-total').text(grandTotal + ' ৳');
        $('#delivery-charge').text(deliveryCharge + ' ৳');

        // HIDDEN INPUT UPDATE
        $('#hidden-product-qty').val(qty);
        $('#hidden-grand-total').val(grandTotal + ' ৳');
    }

    // =====================
    // QTY BUTTON (+)
    // =====================
    $(document).on('click', '.btn-plus', function () {
        let input = $('.qty-input');
        input.val(parseInt(input.val()) + 1);
        updateCartTotals();
    });

    // =====================
    // QTY BUTTON (-)
    // =====================
    $(document).on('click', '.btn-minus', function () {
        let input = $('.qty-input');
        let val = parseInt(input.val());

        if (val > 1) {
            input.val(val - 1);
            updateCartTotals();
        }
    });

    // =====================
    // DELIVERY CHANGE
    // =====================
    $('#delivery-option').on('change', function () {
        updateCartTotals();
    });

    // =====================
    // LOAD PRODUCT FROM LOCALSTORAGE
    // =====================
    const product = JSON.parse(localStorage.getItem("selectedProduct"));

    if (product) {

        basePrice = parseInt(product.newPrice) || 0;

        $('#product-image').attr('src', product.image);
        $('#product-name').text(product.name);
        $('#product-price').text(product.newPrice + ' ৳');

        $('#hidden-product-name').val(product.name);

        updateCartTotals();
    }

    // =====================
    // FORM SUBMIT (AJAX)
    // =====================
    $('#checkout_form').on('submit', function (e) {
        e.preventDefault();

        let form = $(this);
        let submitBtn = form.find('.confirm-btn');

        submitBtn.prop('disabled', true).text('অর্ডার প্রসেস হচ্ছে...');

        $.ajax({
            url: form.attr('action'),
            method: 'POST',
            data: form.serialize(),
            success: function () {

                alert('ধন্যবাদ! আপনার অর্ডার সফলভাবে নেওয়া হয়েছে।');

                form[0].reset();

                $('#district-select').val('').trigger('change');
                $('#upazila-select').val('').trigger('change');

                submitBtn.prop('disabled', false).text('অর্ডার কনফার্ম করুন');

                updateCartTotals();
            },
            error: function () {

                alert('দুঃখিত! আবার চেষ্টা করুন।');

                submitBtn.prop('disabled', false).text('অর্ডার কনফার্ম করুন');
            }
        });
    });

});