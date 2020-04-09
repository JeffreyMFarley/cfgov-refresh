from django.core.urlresolvers import reverse
from django.test import TestCase

from wagtail.tests.utils import WagtailTestUtils


class TemplateDebugViewTests(TestCase, WagtailTestUtils):
    def check(self, template_name):
        self.login()

        url = reverse(f'jobmanager:template_debug_{template_name}')
        response = self.client.get(url)
        self.assertContains(response, f'jobmanager/{template_name}.html')

    def test_job_listing_details_view(self):
        self.check('job_listing_details')

    def test_job_listing_list_view(self):
        self.check('job_listing_list')

    def test_job_listing_table_view(self):
        self.check('job_listing_table')
