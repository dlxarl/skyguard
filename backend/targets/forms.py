from django import forms
from django.utils.safestring import mark_safe
from .models import Target, Shelter


class MapPickerWidget(forms.Widget):
    template_name = 'admin/targets/map_picker_widget.html'
    
    class Media:
        css = {
            'all': (
                'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
                'targets/css/map_picker.css',
            )
        }
        js = (
            'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
            'targets/js/map_picker.js',
        )

    def render(self, name, value, attrs=None, renderer=None):
        return mark_safe('''
            <div id="location-map-picker"></div>
            <p class="map-help-text">
                💡 Click on the map to select a location, or drag the marker. 
                You can also enter coordinates manually below.
            </p>
        ''')


class ShelterAdminForm(forms.ModelForm):
    map_picker = forms.CharField(widget=MapPickerWidget(), required=False, label='Select on map')
    
    class Meta:
        model = Shelter
        fields = '__all__'
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['map_picker'].widget.attrs['class'] = 'map-picker-field'


class TargetAdminForm(forms.ModelForm):
    map_picker = forms.CharField(widget=MapPickerWidget(), required=False, label='Select on map')
    
    class Meta:
        model = Target
        fields = '__all__'
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['map_picker'].widget.attrs['class'] = 'map-picker-field'
