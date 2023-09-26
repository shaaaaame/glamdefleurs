has_variants_toggle = () => {
    has_variants=false
    if (django.jQuery('#id_has_variants').is(':checked')) {
        django.jQuery("#id_variants-TOTAL_FORMS").parent().show();
        django.jQuery("#id_price").parent().hide();
        has_variants=true;
    } else {
        django.jQuery("#id_variants-TOTAL_FORMS").parent().hide();
        django.jQuery("#id_price").parent().show();
        has_variants=false;
    }
    django.jQuery("#id_has_variants").click(function(){
        has_variants=!has_variants;
        if (has_variants) {
            django.jQuery("#id_price").parent().hide()

            django.jQuery('#id_variants-TOTAL_FORMS').parent().show();
        } else {
            django.jQuery("#id_variants-TOTAL_FORMS").parent().hide();
            django.jQuery("#id_price").parent().show()
        }
    })
}

require_contact_toggle = () => {
    require_contact=false;
    if (django.jQuery('#id_require_contact').is(':checked')) {
        django.jQuery(".field-price_text").show();
        require_contact=true;
    } else {
        django.jQuery(".field-price_text").hide();
        require_contact=false;
    }
    django.jQuery("#id_require_contact").click(function(){
        require_contact=!require_contact;
        if (require_contact) {
            django.jQuery(".field-price_text").show();
        } else {
            django.jQuery(".field-price_text").hide();

        }
    })
}

django.jQuery(document).ready(function(){
    has_variants_toggle();
    require_contact_toggle();
})