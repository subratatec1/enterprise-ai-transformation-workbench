"""Deterministic contract tests; no external AI calls or credentials."""

import copy
import io
import json
import unittest
from pathlib import Path
from unittest.mock import patch

from run_summary import SummaryError, indexed_sources, load_sources, render_markdown, request_model, validate_summary


ROOT = Path(__file__).resolve().parents[1]


class ManagementSummaryTests(unittest.TestCase):
    def setUp(self):
        self.sources = load_sources([ROOT / "assets/sample-notes.md"])
        self.data = json.loads((ROOT / "assets/sample-response.json").read_text())

    def test_fixture_is_grounded(self):
        self.assertEqual(validate_summary(self.data, self.sources), self.data)
        rendered = render_markdown(self.data, self.sources, "CIO", mock=True)
        self.assertIn("80% complete", rendered)
        self.assertIn("[S1:L4]", rendered)
        self.assertIn("not an AI-generated result", rendered)

    def test_numbered_source_lines(self):
        lines = indexed_sources(self.sources)
        self.assertIn("[S1:L6] Action:", lines)

    def test_invalid_source_reference_rejected(self):
        invalid = copy.deepcopy(self.data)
        invalid["key_findings"][0]["evidence"] = ["S2:L99"]
        with self.assertRaises(SummaryError):
            validate_summary(invalid, self.sources)

    def test_no_evidence_rejected(self):
        invalid = copy.deepcopy(self.data)
        invalid["risks"][0]["evidence"] = []
        with self.assertRaises(SummaryError):
            validate_summary(invalid, self.sources)

    def test_unapproved_status_rejected(self):
        invalid = copy.deepcopy(self.data)
        invalid["decisions"][0]["status"] = "Approved by AI"
        with self.assertRaises(SummaryError):
            validate_summary(invalid, self.sources)

    def test_source_input_extension_rejected(self):
        with self.assertRaises(SummaryError):
            load_sources([ROOT / "assets/sample-response.json"])

    def test_insecure_remote_model_endpoint_rejected(self):
        with self.assertRaises(SummaryError):
            request_model(self.sources, "CIO", "test-model", "http://untrusted.example/v1", "test-secret")

    @patch("run_summary.urlopen")
    def test_openai_compatible_gateway_contract(self, mocked_urlopen):
        content = json.dumps(self.data)
        mocked_urlopen.return_value.__enter__.return_value = io.BytesIO(
            json.dumps({"choices": [{"message": {"content": content}}]}).encode()
        )
        result = request_model(self.sources, "CIO", "test-model", "https://approved.example/v1", "test-secret")
        self.assertEqual(result["headline"], self.data["headline"])
        request = mocked_urlopen.call_args.args[0]
        self.assertEqual(request.full_url, "https://approved.example/v1/chat/completions")
        self.assertIn(b"[S1:L4]", request.data)


if __name__ == "__main__":
    unittest.main()
