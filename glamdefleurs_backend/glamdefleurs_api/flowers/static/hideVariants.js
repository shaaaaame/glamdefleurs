hide_page=true;
django.jQuery(document).ready(function(){
    if (django.jQuery('#id_has_variants').is(':checked')) {
        django.jQuery("#id_variants-TOTAL_FORMS").parent().show();
        hide_page=false;
    } else {
        django.jQuery("#id_variants-TOTAL_FORMS").parent().hide();
        hide_page=true;
    }
    django.jQuery("#id_has_variants").click(function(){
        hide_page=!hide_page;
        if (hide_page) {
            django.jQuery("#id_variants-TOTAL_FORMS").parent().hide();
        } else {
            django.jQuery("#id_variants-TOTAL_FORMS").parent().show();
        }
    })
})