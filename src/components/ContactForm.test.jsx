import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ContactForm from './ContactForm';

describe('ContactForm', () => {
  const mockSubmit = jest.fn();
  
  beforeEach(() => {
    mockSubmit.mockClear();
  });
  
  test('renders the contact form with all fields', () => {
    render(<ContactForm onSubmit={mockSubmit} />);
    
    // Check for main form elements
    expect(screen.getByText('Get Your Free Case Evaluation')).toBeInTheDocument();
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/ZIP Code/i)).toBeInTheDocument();
    expect(screen.getByText(/Preferred Contact Method/i)).toBeInTheDocument();
    expect(screen.getByText(/Submit My Case for Review/i)).toBeInTheDocument();
  });
  
  test('shows validation errors when form is submitted with empty fields', async () => {
    render(<ContactForm onSubmit={mockSubmit} />);
    
    // Submit the form without filling any fields
    fireEvent.click(screen.getByText(/Submit My Case for Review/i));
    
    // Check for validation error messages
    await waitFor(() => {
      expect(screen.getByText(/First name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Last name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Phone number is required/i)).toBeInTheDocument();
      expect(screen.getByText(/ZIP code is required/i)).toBeInTheDocument();
    });
    
    // Form should not be submitted
    expect(mockSubmit).not.toHaveBeenCalled();
  });
  
  test('formats phone number as user types', () => {
    render(<ContactForm onSubmit={mockSubmit} />);
    
    const phoneInput = screen.getByLabelText(/Phone Number/i);
    
    // Type digits and check formatting
    fireEvent.change(phoneInput, { target: { value: '123' }});
    expect(phoneInput.value).toBe('(123');
    
    fireEvent.change(phoneInput, { target: { value: '(123) 456' }});
    expect(phoneInput.value).toBe('(123) 456');
    
    fireEvent.change(phoneInput, { target: { value: '(123) 456-7890' }});
    expect(phoneInput.value).toBe('(123) 456-7890');
  });
  
  test('submits the form with valid data', async () => {
    render(<ContactForm onSubmit={mockSubmit} />);
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/First Name/i), { 
      target: { value: 'John' } 
    });
    
    fireEvent.change(screen.getByLabelText(/Last Name/i), { 
      target: { value: 'Doe' } 
    });
    
    fireEvent.change(screen.getByLabelText(/Email Address/i), { 
      target: { value: 'john.doe@example.com' } 
    });
    
    fireEvent.change(screen.getByLabelText(/Phone Number/i), { 
      target: { value: '1234567890' } 
    });
    
    fireEvent.change(screen.getByLabelText(/ZIP Code/i), { 
      target: { value: '12345' } 
    });
    
    // Submit the form
    fireEvent.click(screen.getByText(/Submit My Case for Review/i));
    
    // Check that the form was submitted with the correct data
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '(123) 456-7890',
        zipCode: '12345',
        preferredContact: 'phone'
      });
    });
  });
  
  test('renders simplified version when simplified prop is true', () => {
    render(<ContactForm onSubmit={mockSubmit} simplified={true} />);
    
    // Header should not be present in simplified version
    expect(screen.queryByText('Get Your Free Case Evaluation')).not.toBeInTheDocument();
    
    // But form fields should still be there
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
  });
}); 