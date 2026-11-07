import { Accordion, AccordionDetails, AccordionSummary, Box, Container, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SectionTitle from "./SectionTitle";

const faqs = [
  {
    question: "Do I need expensive equipment to start smart farming?",
    answer:
      "No. Smart farming starts with knowing your crop and making decisions based on facts. Our crop guide and agronomist consultations are a free first step; sensors and automation can come later.",
  },
  {
    question: "Is smart farming only for large farms?",
    answer:
      "Not at all. Small farms and home gardens benefit the most from saving water and catching problems early, because every plant counts.",
  },
  {
    question: "How does AL-HASAD GATE help me?",
    answer:
      "You get a guide for each crop with its ideal conditions and growth stages, and you can send a consultation request with photos. An agronomist who specialises in your crop answers it, and you can follow the status until it is solved.",
  },
  {
    question: "Who answers my consultation requests?",
    answer:
      "Certified agronomists on our platform. Each request is assigned by our team to a specialist in the category of your crop, such as fruiting vegetables or leafy greens.",
  },
  {
    question: "How much does it cost?",
    answer: "Creating an account, browsing the crop guide and submitting consultation requests are free.",
  },
  {
    question: "What photos should I send with a request?",
    answer:
      "Clear, close photos of the affected leaves, stems or fruits in daylight, plus one photo of the whole plant. You can attach up to three images (JPG, PNG or WEBP, 5 MB each).",
  },
];

function FaqSection() {
  return (
    <Box component="section" sx={{ py: { xs: 7, md: 10 }, bgcolor: "action.hover" }}>
      <Container maxWidth="md">
        <SectionTitle overline="QUESTIONS" title="Frequently asked questions" />
        {faqs.map((faq, index) => (
          <Accordion
            key={faq.question}
            defaultExpanded={index === 0}
            disableGutters
            elevation={0}
            sx={{
              mb: 1.5,
              borderRadius: "16px !important",
              border: 1,
              borderColor: "divider",
              "&::before": { display: "none" },
              "&.Mui-expanded": { borderColor: "primary.main" },
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 3, py: 1 }}>
              <Typography fontWeight={700}>{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 3, pb: 3 }}>
              <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Container>
    </Box>
  );
}

export default FaqSection;
